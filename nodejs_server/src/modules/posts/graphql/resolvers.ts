import { Context } from '../../../graphql/context';
import { NotAuthenticatedError, NotFoundError, ForbiddenError } from '../../../graphql/errors';
import { validate, CreatePostInputSchema, UpdatePostInputSchema, CommentInputSchema } from '../../../graphql/validation';

export const resolvers = {
	Post: {
		postType: (parent: any) => parent.postType ?? parent.post_type,
		createdAt: (parent: any) => parent.createdAt ?? parent.created_at,
		updatedAt: (parent: any) => parent.updatedAt ?? parent.updated_at,

		// ✅ AHORA: USA DataLoader (batch)
		user: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.user.load(parent.user_id);
		},

		// ✅ AHORA: USA DataLoader
		media: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.postMedia.load(parent.id);
		},

		// ✅ AHORA: USA DataLoader
		likeCount: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.likeCount.load(parent.id);
		},

		// ✅ AHORA: USA DataLoader
		commentCount: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.commentCount.load(parent.id);
		},

		// ✅ AHORA: USA DataLoader
		saveCount: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.saveCount.load(parent.id);
		},

		// ✅ AHORA: USA DataLoader
		viewCount: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.viewCount.load(parent.id);
		},

		// ✅ AHORA: USA DataLoader
		isLikedByCurrentUser: (parent: any, _: any, ctx: Context) => {
			if (!ctx.currentUserId) return false;
			return ctx.loaders.userLikedPost.load({ postId: parent.id });
		},

		// ✅ AHORA: USA DataLoader
		isSavedByCurrentUser: (parent: any, _: any, ctx: Context) => {
			if (!ctx.currentUserId) return false;
			return ctx.loaders.userSavedPost.load({ postId: parent.id });
		},

		// ✅ AHORA: USA DataLoader
		isViewedByCurrentUser: (parent: any, _: any, ctx: Context) => {
			if (!ctx.currentUserId) return false;
			return ctx.loaders.userViewedPost.load({ postId: parent.id });
		},

		// ✅ Este ya está bien (usa índices automáticamente)
		recipe: async (parent: any, _: any, ctx: Context) => {
			if (parent.post_type !== 'RECIPE') return null;
			return await ctx.prisma.recipes.findUnique({
				where: { post_id: parent.id }
			});
		},

		// ✅ Este ya está bien
		comments: async (parent: any, args: any, ctx: Context) => {
			const { first = 20, after } = args;
			const comments = await ctx.prisma.comments.findMany({
				where: { post_id: parent.id },
				take: first + 1,
				skip: after ? 1 : 0,
				cursor: after ? { id: after } : undefined,
				orderBy: { created_at: 'desc' } // ← Usa idx_comments_post_id_created_at
			});

			const hasNextPage = comments.length > first;
			const edges = comments.slice(0, first).map((comment: { id: any; }) => ({
				node: comment,
				cursor: comment.id
			}));

			return {
				edges,
				pageInfo: {
					hasNextPage,
					hasPreviousPage: !!after,
					startCursor: edges[0]?.cursor,
					endCursor: edges[edges.length - 1]?.cursor
				},
				totalCount: await ctx.prisma.comments.count({
					where: { post_id: parent.id }
				})
			};
		},

		// ✅ Este ya está bien
		likes: async (parent: any, args: any, ctx: Context) => {
			const { first = 20 } = args;
			const likes = await ctx.prisma.likes.findMany({
				where: { post_id: parent.id },
				take: first,
				include: { user: true }
			});
			return likes.map((l: { user: any; }) => l.user);
		}
	},

	PostMedia: {
		postId: (parent: any) => parent.postId ?? parent.post_id,
		mediaUrl: (parent: any) => parent.mediaUrl ?? parent.media_url,
		mediaType: (parent: any) => parent.mediaType ?? parent.media_type,
	},

	// ✅ Agregar resolver para Comment.user
	Comment: {
		createdAt: (parent: any) => parent.createdAt ?? parent.created_at,

		user: (parent: any, _: any, ctx: Context) => {
			return ctx.loaders.user.load(parent.user_id);
		},

		post: async (parent: any, _: any, ctx: Context) => {
			return await ctx.prisma.posts.findUnique({ where: { id: parent.post_id } });
		}
	},

	User: {
		// ✅ Este ya está bien (solo agregar tipo Loaders si falta)
		posts: async (parent: any, args: any, ctx: Context) => {
			const { first = 20, after, orderBy } = args;

			const posts = await ctx.prisma.posts.findMany({
				where: { user_id: parent.id },
				take: first + 1,
				skip: after ? 1 : 0,
				cursor: after ? { id: after } : undefined,
				orderBy: {
					[orderBy?.field?.toLowerCase() || 'created_at']:
						orderBy?.direction?.toLowerCase() || 'desc'
				}
			});

			const hasNextPage = posts.length > first;
			const edges = posts.slice(0, first).map((post: { id: any; }) => ({
				node: post,
				cursor: post.id
			}));

			return {
				edges,
				pageInfo: {
					hasNextPage,
					hasPreviousPage: !!after,
					startCursor: edges[0]?.cursor,
					endCursor: edges[edges.length - 1]?.cursor
				},
				totalCount: await ctx.prisma.posts.count({
					where: { user_id: parent.id }
				})
			};
		}
	},

	Recipe: {
		postId: (parent: any) => parent.postId ?? parent.post_id,
		timeRequired: (parent: any) => parent.timeRequired ?? parent.time_required,
		estimatedCost: (parent: any) => parent.estimatedCost ?? parent.estimated_cost,

		ingredients: async (parent: any, _: any, ctx: Context) => {
			const recipeIngredients = await ctx.prisma.recipe_ingredients.findMany({
				where: { recipe_id: parent.id },
				include: { ingredient: true }
			});
			return recipeIngredients.map((ri: { ingredient: any; quantity: any; notes: any; }) => ({
				ingredient: ri.ingredient,
				quantity: ri.quantity,
				notes: ri.notes
			}));
		},

		hasSafeIngredientsFor: async (parent: any, args: any, ctx: Context) => {
			const { userId } = args;
			const userAllergies = await ctx.prisma.user_allergies.findMany({
				where: { user_id: userId },
				select: { allergen_id: true }
			});

			if (userAllergies.length === 0) return true;
			const allergenIds = userAllergies.map((ua: { allergen_id: any; }) => ua.allergen_id);

			const dangerousIngredients = await ctx.prisma.recipe_ingredients.count({
				where: {
					recipe_id: parent.id,
					ingredient: {
						allergen_ingredients: {
							some: {
								allergen_id: { in: allergenIds }
							}
						}
					}
				}
			});
			return dangerousIngredients === 0;
		}
	},

	Ingredient: {
		allergens: async (parent: any, _: any, ctx: Context) => {
			const allergenIngredients = await ctx.prisma.allergen_ingredients.findMany({
				where: { ingredient_id: parent.id },
				include: { allergen: true }
			});
			return allergenIngredients.map((ai: { allergen: any; }) => ai.allergen);
		}
	},

	Query: {
		homeFeed: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
			const { first = 20, after } = args;

			const following = await ctx.prisma.follows.findMany({
				where: { follower_id: ctx.currentUserId },
				select: { followed_id: true }
			});
			const followingIds = following.map((f: { followed_id: any; }) => f.followed_id);

			// Esta query usa idx_posts_user_created automáticamente
			const posts = await ctx.prisma.posts.findMany({
				where: { user_id: { in: followingIds } },
				take: first + 1,
				skip: after ? 1 : 0,
				cursor: after ? { id: after } : undefined,
				orderBy: { created_at: 'desc' }
			});

			const hasNextPage = posts.length > first;
			const edges = posts.slice(0, first).map((post: { id: any; }) => ({
				node: post,
				cursor: post.id
			}));

			return {
				edges,
				pageInfo: {
					hasNextPage,
					hasPreviousPage: !!after,
					startCursor: edges[0]?.cursor,
					endCursor: edges[edges.length - 1]?.cursor
				},
				totalCount: await ctx.prisma.posts.count({
					where: { user_id: { in: followingIds } }
				})
			};
		},

		explorePosts: async (_: any, args: any, ctx: Context) => {
			const { categories, first = 20, after } = args;

			const posts = await ctx.prisma.posts.findMany({
				where: categories ? { categories: { hasSome: categories } } : {},
				take: first + 1,
				skip: after ? 1 : 0,
				cursor: after ? { id: after } : undefined,
				orderBy: { created_at: 'desc' }
			});

			const hasNextPage = posts.length > first;
			const edges = posts.slice(0, first).map((post: { id: any; }) => ({
				node: post,
				cursor: post.id
			}));

			return {
				edges,
				pageInfo: {
					hasNextPage,
					hasPreviousPage: !!after,
					startCursor: edges[0]?.cursor,
					endCursor: edges[edges.length - 1]?.cursor
				},
				totalCount: await ctx.prisma.posts.count({
					where: categories ? { categories: { hasSome: categories } } : {}
				})
			};
		},

		post: async (_: any, args: any, ctx: Context) => {
			return await ctx.prisma.posts.findUnique({ where: { id: args.id } });
		},

		searchPosts: async (_: any, args: any, ctx: Context) => {
			const { query, first = 20 } = args;

			return await ctx.prisma.posts.findMany({
				where: {
					OR: [
						{ title: { contains: query, mode: 'insensitive' } },
						{ description: { contains: query, mode: 'insensitive' } }
					]
				},
				take: first
			});
		}
	},

	Mutation: {
		// ✅ Las mutations permanecen igual
		createPost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
			const input = validate(CreatePostInputSchema, args.input);

			const post = await ctx.prisma.posts.create({
				data: {
					user_id: ctx.currentUserId,
					post_type: input.postType,
					title: input.title,
					description: input.description,
					categories: input.categories
				}
			});

			if (input.mediaUrls) {
				await Promise.all(
					input.mediaUrls.map((url: string, index: number) =>
						ctx.prisma.post_media.create({
							data: {
								post_id: post.id,
								media_url: url,
								media_type: input.postType === 'VIDEO' ? 'video' : 'image',
								position: index
							}
						})
					)
				);
			}

			if (input.postType === 'RECIPE' && input.recipe) {
				await ctx.prisma.recipes.create({
					data: {
						id: post.id,
						post_id: post.id,
						name: input.recipe.name,
						description: input.recipe.description,
						steps: input.recipe.steps,
						difficulty: input.recipe.difficulty,
						time_required: input.recipe.timeRequired,
						estimated_cost: input.recipe.estimatedCost,
						servings: input.recipe.servings
					}
				});

				if (input.recipe.ingredients) {
					await Promise.all(
						input.recipe.ingredients.map((ingredient: any) =>
							ctx.prisma.recipe_ingredients.create({
								data: {
									recipe_id: post.id,
									ingredient_id: ingredient.ingredientId,
									quantity: ingredient.quantity,
									notes: ingredient.notes
								}
							})
						)
					);
				}
			}
			return post;
		},

		updatePost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
			const { id } = args;
			const input = validate(UpdatePostInputSchema, args.input);

			const post = await ctx.prisma.posts.findUnique({ where: { id } });
			if (!post) throw new NotFoundError('Post');
			if (post.user_id !== ctx.currentUserId) throw new ForbiddenError('update this post');

			return await ctx.prisma.posts.update({
				where: { id },
				data: {
					...(input.title !== undefined && { title: input.title }),
					...(input.description !== undefined && { description: input.description }),
					...(input.categories !== undefined && { categories: input.categories })
				}
			});
		},

		deletePost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();

			const post = await ctx.prisma.posts.findUnique({ where: { id: args.id } });
			if (!post) throw new NotFoundError('Post');
			if (post.user_id !== ctx.currentUserId) throw new ForbiddenError('delete this post');

			await ctx.prisma.posts.delete({ where: { id: args.id } });
			return true;
		},

		likePost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
			await ctx.prisma.likes.create({
				data: { user_id: ctx.currentUserId, post_id: args.postId }
			});
			return await ctx.prisma.posts.findUnique({ where: { id: args.postId } });
		},

		unlikePost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
			await ctx.prisma.likes.delete({
				where: {
					user_id_post_id: { user_id: ctx.currentUserId, post_id: args.postId }
				}
			});
			return await ctx.prisma.posts.findUnique({ where: { id: args.postId } });
		},

		savePost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
			await ctx.prisma.saved_posts.create({
				data: { user_id: ctx.currentUserId, post_id: args.postId }
			});
			return await ctx.prisma.posts.findUnique({ where: { id: args.postId } });
		},

		unsavePost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
			await ctx.prisma.saved_posts.delete({
				where: { user_id_post_id: { user_id: ctx.currentUserId, post_id: args.postId } }
			});
			return await ctx.prisma.posts.findUnique({ where: { id: args.postId } });
		},

		viewPost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
			await ctx.prisma.viewed_posts.upsert({
				where: { user_id_post_id: { user_id: ctx.currentUserId, post_id: args.postId } },
				create: { user_id: ctx.currentUserId, post_id: args.postId },
				update: { viewed_at: new Date() }
			});
			return await ctx.prisma.posts.findUnique({ where: { id: args.postId } });
		},

		commentOnPost: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();
			const { text } = validate(CommentInputSchema, args);
			return await ctx.prisma.comments.create({
				data: { user_id: ctx.currentUserId, post_id: args.postId, text }
			});
		},

		deleteComment: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();

			const comment = await ctx.prisma.comments.findUnique({ where: { id: args.commentId } });
			if (!comment) throw new NotFoundError('Comment');
			if (comment.user_id !== ctx.currentUserId) throw new ForbiddenError('delete this comment');

			await ctx.prisma.comments.delete({ where: { id: args.commentId } });
			return true;
		}
	}
}
