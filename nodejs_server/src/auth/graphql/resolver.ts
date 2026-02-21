import { Context } from '../../graphql/context';
import { supabase } from '../../config/supabase';
import { NotAuthenticatedError, ConflictError } from '../../graphql/errors';

export const resolvers = {
	Mutation: {
		register: async (_: any, args: any, ctx: Context) => {
			const {
				email,
				password,
				username,
				fullName,
				bio,
				photoUrl,
				location,
				birthDate
			} = args;

			const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

			if (authError) throw new ConflictError(`Authentication failed: ${authError.message}`);
			if (!authData.user) throw new ConflictError('User creation failed');

			const userId = authData.user.id;

			const newUser = await ctx.prisma.users.upsert({
				where: { id: userId },
				create: { id: userId, user_type: 'PERSON', created_at: new Date(), updated_at: new Date() },
				update: { updated_at: new Date() }
			});

			const personProfile = await ctx.prisma.person_profiles.upsert({
				where: { user_id: userId },
				create: {
					user_id: userId,
					username: username.toLowerCase(),
					full_name: fullName || null,
					photo_url: photoUrl || null,
					bio: bio || null,
					location: location || null,
					birth_date: new Date(birthDate)
				},
				update: {
					username: username.toLowerCase(),
					full_name: fullName || null,
					photo_url: photoUrl || null,
					bio: bio || null,
					location: location || null,
					birth_date: new Date(birthDate)
				}
			});

			return {
				token: authData.session?.access_token || 'check-email-confirmation',
				user: {
					id: newUser.id,
					email,
					userType: 'PERSON',
					createdAt: newUser.created_at
				},
				personProfile: {
					userId: personProfile.user_id,
					username: personProfile.username,
					fullName: personProfile.full_name,
					bio: personProfile.bio,
					photoUrl: personProfile.photo_url,
					location: personProfile.location,
					birthDate: personProfile.birth_date
				}
			};
		},

		login: async (_: any, args: any, ctx: Context) => {
			const { email, password } = args;

			const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

			if (authError) throw new ConflictError(`Login failed: ${authError.message}`);
			if (!authData.user || !authData.session) throw new ConflictError('Login failed');

			const userId = authData.user.id;

			let dbUser = await ctx.prisma.users.findUnique({ where: { id: userId } });

			if (!dbUser) {
				dbUser = await ctx.prisma.users.create({
					data: { id: userId, user_type: 'PERSON', created_at: new Date(), updated_at: new Date() }
				});
			}

			let personProfile = await ctx.prisma.person_profiles.findUnique({ where: { user_id: userId } });

			if (!personProfile) {
				personProfile = await ctx.prisma.person_profiles.create({
					data: {
						user_id: userId,
						username: email.split('@')[0].toLowerCase(),
						birth_date: new Date()
					}
				});
			}

			return {
				token: authData.session.access_token,
				user: {
					id: dbUser.id,
					email,
					userType: dbUser.user_type,
					createdAt: dbUser.created_at
				},
				personProfile: {
					userId: personProfile.user_id,
					username: personProfile.username,
					fullName: personProfile.full_name,
					bio: personProfile.bio,
					photoUrl: personProfile.photo_url,
					location: personProfile.location,
					birthDate: personProfile.birth_date
				}
			};
		},

		syncUser: async (_: any, args: any, ctx: Context) => {
			if (!ctx.currentUserId) throw new NotAuthenticatedError();

			const { username, fullName, bio, photoUrl, location, birthDate } = args;
			const userId = ctx.currentUserId;

			const personProfile = await ctx.prisma.person_profiles.upsert({
				where: { user_id: userId },
				create: {
					user_id: userId,
					username: username.toLowerCase(),
					full_name: fullName || null,
					photo_url: photoUrl || null,
					bio: bio || null,
					location: location || null,
					birth_date: new Date(birthDate)
				},
				update: {
					username: username.toLowerCase(),
					full_name: fullName || null,
					photo_url: photoUrl || null,
					bio: bio || null,
					location: location || null,
					birth_date: new Date(birthDate)
				}
			});

			const user = await ctx.prisma.users.findUnique({ where: { id: userId } });

			return {
				success: true,
				message: 'Usuario sincronizado correctamente',
				user: {
					id: user?.id,
					email: ctx.currentUserEmail,
					userType: user?.user_type || 'PERSON',
					createdAt: user?.created_at
				},
				personProfile: {
					userId: personProfile.user_id,
					username: personProfile.username,
					fullName: personProfile.full_name,
					bio: personProfile.bio,
					photoUrl: personProfile.photo_url,
					location: personProfile.location,
					birthDate: personProfile.birth_date
				}
			};
		},

		logout: async (_: any, __: any, ctx: Context) => {
			const { error } = await supabase.auth.signOut();
			if (error) throw new ConflictError(`Logout failed: ${error.message}`);
			return true;
		}
	}
};
