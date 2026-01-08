"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postResolvers = void 0;
const post_service_1 = require("../../services/post.service");
const likes_controller_1 = require("../../modules/likes/likes.controller");
const user_service_1 = require("../../services/user.service");
const place_service_1 = require("../../services/place.service");
/**
 * Resolvers para el tipo Post
 * Estos resolvers manejan campos calculados y relaciones del tipo Post
 */
// Función auxiliar para mapear posts
const mapPost = async (post, user_id) => {
    const is_liked = await likes_controller_1.LikesController.userHasLikedPost(user_id, post.id);
    return {
        ...post,
        is_liked,
        likesCount: post._count?.likes || 0,
        commentsCount: post._count?.comments || 0,
        // Asegurar que estos campos siempre están presentes
        media_url: post.media_url || null,
        description: post.recipes?.description || post.content || null,
        time_required: post.recipes?.time_required || null,
    };
};
const Post = {
    // Resolver para la relación user
    user: (parent) => {
        // Si el post ya incluye el usuario (desde el include de Prisma), lo devolvemos
        if (parent.users) {
            return {
                id: parent.users.id,
                username: parent.users.username,
                photo_url: parent.users.photo_url,
            };
        }
        // Si no está incluido, podríamos hacer una consulta adicional, pero normalmente estará incluido
        return {
            id: null,
            username: 'Usuario no encontrado',
            photo_url: null, /* Podríamos sustituir por una imagen de placeholder */
        };
    },
    // Resolver para likesCount
    likesCount: (parent) => {
        // Si viene del _count de Prisma
        if (parent._count?.likes !== undefined) {
            return parent._count.likes;
        }
        // Si no, devolvemos 0 o podríamos hacer una consulta adicional
        return 0;
    },
    // Resolver para commentsCount
    commentsCount: (parent) => {
        // Si viene del _count de Prisma
        if (parent._count?.comments !== undefined) {
            return parent._count.comments;
        }
        // Si no, devolvemos 0
        return 0;
    },
    // Resolver para savedCount (favoritos)
    savedCount: (parent) => {
        // Si viene del _count de Prisma
        if (parent._count?.user_saved_posts !== undefined) {
            return parent._count.user_saved_posts;
        }
        // Si no, devolvemos 0
        return 0;
    },
    // Resolver para description (de recipe o content del post)
    description: (parent) => {
        // Si tiene recipe, usar la descripción de la receta
        if (parent.recipes?.description) {
            return parent.recipes.description;
        }
        // Si no, usar el content del post
        return parent.content || null;
    },
    // Resolver para time_required (de recipe)
    time_required: (parent) => {
        return parent.recipes?.time_required || null;
    },
    // Resolver para money (por ahora null, se puede agregar al schema de Prisma después)
    money: (parent) => {
        // Por ahora retornamos null, pero puedes agregar un campo money a recipes o posts
        return null;
    },
    // Resolver para is_liked (requiere user_id del contexto o args)
    is_liked: async (parent, args, context) => {
        // El user_id puede venir del contexto (usuario autenticado) o de los args
        const user_id = context?.user_id || args?.user_id;
        if (!user_id) {
            return false;
        }
        try {
            return await likes_controller_1.LikesController.userHasLikedPost(user_id, parent.id);
        }
        catch (error) {
            return false;
        }
    },
    // Convertir Date a String para created_at
    created_at: (parent) => {
        if (parent.created_at) {
            return parent.created_at instanceof Date
                ? parent.created_at.toISOString()
                : parent.created_at;
        }
        return null;
    },
    // Convertir Date a String para updated_at
    updated_at: (parent) => {
        if (parent.updated_at) {
            return parent.updated_at instanceof Date
                ? parent.updated_at.toISOString()
                : parent.updated_at;
        }
        return null;
    },
};
/**
 * Resolvers para las Queries de Posts
 */
const Query = {
    /**
     * Obtener feed de posts con paginación
     * Equivalente a GET /api/posts
     */
    posts: async (_, args, context) => {
        const { limit, user_id, cursor } = args;
        // Validar que user_id esté presente
        if (!user_id) {
            throw new Error('El parámetro user_id es requerido');
        }
        // Validar que el usuario existe
        const user = await user_service_1.UserService.getUserById(user_id);
        if (!user) {
            throw new Error('El usuario no existe');
        }
        // Limitar el máximo de posts a 15
        const limitParsed = Math.min(limit || 5, 15);
        // Obtener posts del feed
        const allPosts = await post_service_1.PostService.getFeedPosts(limitParsed, user_id, cursor);
        // Verificar si hay más posts
        const hasMore = allPosts.length > limitParsed;
        const rawPosts = hasMore ? allPosts.slice(0, limitParsed) : allPosts;
        // Agregar is_liked a cada post
        const posts = await Promise.all(rawPosts.map(async (post) => {
            const is_liked = await likes_controller_1.LikesController.userHasLikedPost(user_id, post.id);
            return {
                ...post,
                is_liked,
                likesCount: post._count?.likes || 0, // ✅ Mapear _count.likes a likesCount
                commentsCount: post._count?.comments || 0 // ✅ Mapear _count.comments a commentsCount
            };
        }));
        // Obtener el cursor del último post
        const nextCursor = posts.length > 0 ? posts[posts.length - 1].created_at : null;
        return {
            data: posts,
            next_cursor: nextCursor,
            has_more: hasMore,
        };
    },
    /**
     * Obtener un post por ID
     * Equivalente a GET /api/posts/:id
     */
    post: async (_, args, context) => {
        const { id, user_id } = args;
        const post = await post_service_1.PostService.getPostById(id);
        if (!post) {
            return null;
        }
        // Si se proporciona user_id, verificar si el usuario ha dado like
        let is_liked = false;
        if (user_id) {
            is_liked = await likes_controller_1.LikesController.userHasLikedPost(user_id, id);
        }
        return {
            ...post,
            is_liked,
            likesCount: post._count?.likes || 0, // ✅ Mapear _count.likes a likesCount
            commentsCount: post._count?.comments || 0 // ✅ Mapear _count.comments a commentsCount
        };
    },
    /**
     * Obtener posts de un usuario específico
     * Equivalente a GET /api/users/:target_user_id/posts
     */
    userPosts: async (_, args, context) => {
        const { target_user_id, user_id } = args;
        if (!user_id) {
            throw new Error('El parámetro user_id es requerido');
        }
        // Validar que el usuario objetivo existe
        const targetUser = await user_service_1.UserService.getUserById(target_user_id);
        if (!targetUser) {
            throw new Error('El usuario del perfil no existe');
        }
        // Obtener posts del usuario
        const rawPosts = await post_service_1.PostService.getUserPosts(target_user_id);
        // Agregar is_liked a cada post
        const posts = await Promise.all(rawPosts.map(async (post) => {
            const is_liked = await likes_controller_1.LikesController.userHasLikedPost(user_id, post.id);
            return {
                ...post,
                is_liked,
                likesCount: post._count?.likes || 0, // ✅ Mapear _count.likes a likesCount
                commentsCount: post._count?.comments || 0 // ✅ Mapear _count.comments a commentsCount
            };
        }));
        return posts;
    },
    /**
     * Obtener posts guardados por un usuario
     * Equivalente a GET /api/users/:id/saved
     */
    savedPosts: async (_, args, context) => {
        const { user_id } = args;
        if (!user_id) {
            throw new Error('El parámetro user_id es requerido');
        }
        const savedPosts = await post_service_1.PostService.getSavedPosts(user_id);
        // Transformar la respuesta de Prisma al formato esperado
        const posts = await Promise.all(savedPosts.map(async (saved) => {
            const post = saved.posts;
            const is_liked = await likes_controller_1.LikesController.userHasLikedPost(user_id, post.id);
            return {
                ...post,
                is_liked,
                likesCount: post._count?.likes || 0, // ✅ Mapear _count.likes a likesCount
                commentsCount: post._count?.comments || 0 // ✅ Mapear _count.comments a commentsCount
            };
        }));
        return posts;
    },
    /**
     * PANTALLA INICIO: Posts con autor completo, descripción, tiempo_estimado, dinero, likes, comentarios y favoritos
     */
    homePosts: async (_, args, context) => {
        const { user_id, limit, cursor } = args;
        if (!user_id) {
            throw new Error('El parámetro user_id es requerido');
        }
        // Validar que el usuario existe
        const user = await user_service_1.UserService.getUserById(user_id);
        if (!user) {
            throw new Error('El usuario no existe');
        }
        // Limitar el máximo de posts a 15
        const limitParsed = Math.min(limit || 5, 15);
        // Obtener posts para la pantalla inicio
        const allPosts = await post_service_1.PostService.getHomePosts(limitParsed, user_id, cursor);
        // Verificar si hay más posts
        const hasMore = allPosts.length > limitParsed;
        const rawPosts = hasMore ? allPosts.slice(0, limitParsed) : allPosts;
        // Agregar is_liked a cada post
        const posts = await Promise.all(rawPosts.map(async (post) => {
            const is_liked = await likes_controller_1.LikesController.userHasLikedPost(user_id, post.id);
            return {
                ...post,
                is_liked,
                likesCount: post._count?.likes || 0, // ✅ Mapear _count.likes a likesCount
                commentsCount: post._count?.comments || 0 // ✅ Mapear _count.comments a commentsCount
            };
        }));
        // Obtener el cursor del último post
        const nextCursor = posts.length > 0 ? posts[posts.length - 1].created_at : null;
        return {
            data: posts,
            next_cursor: nextCursor,
            has_more: hasMore,
        };
    },
    /**
     * PANTALLA PLACE: Obtener un place con toda su información
     */
    place: async (_, args, context) => {
        const { id } = args;
        const place = await place_service_1.PlaceService.getPlaceById(id);
        if (!place) {
            return null;
        }
        return place;
    },
    /**
     * PANTALLA EXPLORAR: Posts aleatorios ordenados por fecha más reciente (para infinite scroll)
     */
    explorePosts: async (_, args, context) => {
        const { user_id, limit, cursor } = args;
        const limitParsed = limit || 12; // Valor por defecto de 12 si no se proporciona
        if (!user_id) {
            throw new Error('El parámetro user_id es requerido');
        }
        // Validar que el usuario existe
        const user = await user_service_1.UserService.getUserById(user_id);
        if (!user) {
            throw new Error('El usuario no existe');
        }
        // Limitar el máximo de posts a 20
        const finalLimit = Math.min(limitParsed, 20);
        // Obtener posts aleatorios ordenados por fecha más reciente
        const allPosts = await post_service_1.PostService.getExplorePosts(finalLimit, user_id, cursor);
        // Verificar si hay más posts
        const hasMore = allPosts.length > finalLimit;
        const rawPosts = hasMore ? allPosts.slice(0, finalLimit) : allPosts;
        // Agregar is_liked a cada post
        const posts = await Promise.all(rawPosts.map(async (post) => {
            const is_liked = await likes_controller_1.LikesController.userHasLikedPost(user_id, post.id);
            return {
                ...post,
                is_liked,
                likesCount: post._count?.likes || 0,
                commentsCount: post._count?.comments || 0,
                // Asegurar que estos campos siempre están presentes
                media_url: post.media_url || null,
                description: post.recipes?.description || post.content || null,
                time_required: post.recipes?.time_required || null,
            };
        }));
        // Obtener el cursor del último post
        const nextCursor = posts.length > 0 ? posts[posts.length - 1].created_at : null;
        return {
            data: posts,
            next_cursor: nextCursor,
            has_more: hasMore,
        };
    },
    /**
     * PANTALLA PERFIL: Información del perfil del usuario
     */
    userProfile: async (_, args, context) => {
        const { user_id, target_user_id } = args;
        if (!user_id) {
            throw new Error('El parámetro user_id es requerido');
        }
        // Obtener información del perfil
        const profileData = await user_service_1.UserService.getUserProfile(target_user_id);
        if (!profileData) {
            throw new Error('El usuario del perfil no existe');
        }
        // Obtener posts del usuario
        const rawPosts = await post_service_1.PostService.getUserPosts(target_user_id);
        // Agregar is_liked a cada post
        const posts = await Promise.all(rawPosts.map(async (post) => {
            const is_liked = await likes_controller_1.LikesController.userHasLikedPost(user_id, post.id);
            return {
                ...post,
                is_liked,
                likesCount: post._count?.likes || 0, // ✅ Mapear _count.likes a likesCount
                commentsCount: post._count?.comments || 0 // ✅ Mapear _count.comments a commentsCount
            };
        }));
        return {
            id: profileData.id,
            username: profileData.username,
            photo_url: profileData.photo_url,
            bio: profileData.bio,
            location: profileData.location,
            postsCount: profileData.postsCount,
            posts,
            followersCount: profileData.followersCount,
            followingCount: profileData.followingCount,
        };
    },
};
/**
 * Resolvers para las Mutations de Posts
 */
const Mutation = {
    /**
     * Crear un nuevo post
     * Equivalente a POST /api/posts
     */
    createPost: async (_, args, context) => {
        const { input } = args;
        const post = await post_service_1.PostService.createPost(input);
        // Obtener el post completo con relaciones para devolverlo
        const fullPost = await post_service_1.PostService.getPostById(post.id);
        return fullPost || post;
    },
    /**
     * Actualizar un post existente
     * Equivalente a PUT /api/posts/:id
     */
    updatePost: async (_, args, context) => {
        const { id, input } = args;
        const post = await post_service_1.PostService.updatePost(id, input);
        return post;
    },
    /**
     * Eliminar un post
     * Equivalente a DELETE /api/posts/:id
     */
    deletePost: async (_, args, context) => {
        const { id } = args;
        await post_service_1.PostService.deletePost(id);
        return true;
    },
    /**
     * Guardar un post (agregar a favoritos)
     * Equivalente a POST /api/users/:id/saved
     */
    savePost: async (_, args, context) => {
        const { user_id, post_id } = args;
        await post_service_1.PostService.savePost(user_id, post_id);
        return true;
    },
    /**
     * Quitar un post de favoritos
     * Equivalente a DELETE /api/users/:id/saved/:postId
     */
    unsavePost: async (_, args, context) => {
        const { user_id, post_id } = args;
        await post_service_1.PostService.unsavePost(user_id, post_id);
        return true;
    },
};
/**
 * Resolvers para el tipo Place
 */
const Place = {
    likesCount: (parent) => {
        return parent.likesCount || 0;
    },
    commentsCount: (parent) => {
        return parent.commentsCount || 0;
    },
    reservationsCount: (parent) => {
        return parent.reservationsCount || 0;
    },
    rating: (parent) => {
        // Convertir Decimal a Float
        return parent.rating ? parseFloat(parent.rating.toString()) : null;
    },
};
/**
 * Resolvers para el tipo UserProfile
 */
const UserProfile = {
    postsCount: (parent) => {
        return parent.postsCount || 0;
    },
    followersCount: (parent) => {
        return parent.followersCount || 0;
    },
    followingCount: (parent) => {
        return parent.followingCount || 0;
    },
};
/**
 * Exportar todos los resolvers de Posts
 */
exports.postResolvers = {
    Post,
    Place,
    UserProfile,
    Query,
    Mutation,
};
//# sourceMappingURL=post.resolvers.js.map