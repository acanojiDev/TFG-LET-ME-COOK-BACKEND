/**
 * Exportar todos los resolvers de Posts
 */
export declare const postResolvers: {
    Post: {
        user: (parent: any) => {
            id: any;
            username: any;
            photo_url: any;
        };
        likesCount: (parent: any) => any;
        commentsCount: (parent: any) => any;
        savedCount: (parent: any) => any;
        description: (parent: any) => any;
        time_required: (parent: any) => any;
        money: (parent: any) => null;
        is_liked: (parent: any, args: any, context: any) => Promise<boolean>;
        created_at: (parent: any) => any;
        updated_at: (parent: any) => any;
    };
    Place: {
        likesCount: (parent: any) => any;
        commentsCount: (parent: any) => any;
        reservationsCount: (parent: any) => any;
        rating: (parent: any) => number | null;
    };
    UserProfile: {
        postsCount: (parent: any) => any;
        followersCount: (parent: any) => any;
        followingCount: (parent: any) => any;
    };
    Query: {
        /**
         * Obtener feed de posts con paginación
         * Equivalente a GET /api/posts
         */
        posts: (_: any, args: {
            limit?: number;
            user_id: string;
            cursor?: string;
        }, context: any) => Promise<{
            data: any[];
            next_cursor: any;
            has_more: boolean;
        }>;
        /**
         * Obtener un post por ID
         * Equivalente a GET /api/posts/:id
         */
        post: (_: any, args: {
            id: string;
            user_id?: string;
        }, context: any) => Promise<{
            is_liked: boolean;
            likesCount: number;
            commentsCount: number;
            users: {
                username: string;
                photo_url: string | null;
                id: string;
            };
            _count: {
                comments: number;
                likes: number;
                user_saved_posts: number;
            };
            recipes: {
                description: string | null;
                time_required: number | null;
            } | null;
            type: string;
            id: string;
            updated_at: Date | null;
            user_id: string;
            content: string | null;
            media_url: string | null;
            created_at: Date | null;
        } | null>;
        /**
         * Obtener posts de un usuario específico
         * Equivalente a GET /api/users/:target_user_id/posts
         */
        userPosts: (_: any, args: {
            target_user_id: string;
            user_id: string;
        }, context: any) => Promise<any[]>;
        /**
         * Obtener posts guardados por un usuario
         * Equivalente a GET /api/users/:id/saved
         */
        savedPosts: (_: any, args: {
            user_id: string;
        }, context: any) => Promise<any[]>;
        /**
         * PANTALLA INICIO: Posts con autor completo, descripción, tiempo_estimado, dinero, likes, comentarios y favoritos
         */
        homePosts: (_: any, args: {
            user_id: string;
            limit?: number;
            cursor?: string;
        }, context: any) => Promise<{
            data: any[];
            next_cursor: any;
            has_more: boolean;
        }>;
        /**
         * PANTALLA PLACE: Obtener un place con toda su información
         */
        place: (_: any, args: {
            id: string;
        }, context: any) => Promise<{
            likesCount: number;
            commentsCount: number;
            reservationsCount: number;
            place_reviews: {
                id: string;
            }[];
            _count: {
                place_reviews: number;
            };
            type: string | null;
            name: string;
            id: string;
            media_url: string;
            description: string | null;
            address: string;
            tags: string[];
            rating: import("@prisma/client-runtime-utils").Decimal | null;
            open: boolean | null;
        } | null>;
        /**
         * PANTALLA EXPLORAR: Posts aleatorios ordenados por fecha más reciente (para infinite scroll)
         */
        explorePosts: (_: any, args: {
            user_id: string;
            limit?: number;
            cursor?: string;
        }, context: any) => Promise<{
            data: any[];
            next_cursor: any;
            has_more: boolean;
        }>;
        /**
         * PANTALLA PERFIL: Información del perfil del usuario
         */
        userProfile: (_: any, args: {
            user_id: string;
            target_user_id: string;
        }, context: any) => Promise<{
            id: string;
            username: string;
            photo_url: string | null;
            bio: string | null;
            location: string | null;
            postsCount: number;
            posts: any[];
            followersCount: number;
            followingCount: number;
        }>;
    };
    Mutation: {
        /**
         * Crear un nuevo post
         * Equivalente a POST /api/posts
         */
        createPost: (_: any, args: {
            input: any;
        }, context: any) => Promise<{
            type: string;
            id: string;
            updated_at: Date | null;
            user_id: string;
            content: string | null;
            media_url: string | null;
            created_at: Date | null;
        }>;
        /**
         * Actualizar un post existente
         * Equivalente a PUT /api/posts/:id
         */
        updatePost: (_: any, args: {
            id: string;
            input: any;
        }, context: any) => Promise<{
            type: string;
            id: string;
            updated_at: Date | null;
            user_id: string;
            content: string | null;
            media_url: string | null;
            created_at: Date | null;
        }>;
        /**
         * Eliminar un post
         * Equivalente a DELETE /api/posts/:id
         */
        deletePost: (_: any, args: {
            id: string;
        }, context: any) => Promise<boolean>;
        /**
         * Guardar un post (agregar a favoritos)
         * Equivalente a POST /api/users/:id/saved
         */
        savePost: (_: any, args: {
            user_id: string;
            post_id: string;
        }, context: any) => Promise<boolean>;
        /**
         * Quitar un post de favoritos
         * Equivalente a DELETE /api/users/:id/saved/:postId
         */
        unsavePost: (_: any, args: {
            user_id: string;
            post_id: string;
        }, context: any) => Promise<boolean>;
    };
};
//# sourceMappingURL=post.resolvers.d.ts.map