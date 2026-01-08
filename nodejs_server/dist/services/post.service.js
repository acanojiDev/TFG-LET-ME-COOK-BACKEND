"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostService = void 0;
const database_1 = require("../config/database");
const postInclude = {
    users: {
        select: {
            id: true,
            username: true,
            photo_url: true,
        },
    },
    recipes: {
        select: {
            description: true,
            time_required: true,
        }
    },
    /// Solo devuelve el numero de likes, comentarios y favoritos.
    _count: {
        select: {
            comments: true,
            likes: true,
            user_saved_posts: true,
        }
    }
};
class PostService {
    static async savePost(userId, postId) {
        return await database_1.prisma.user_saved_posts.create({
            data: {
                user_id: userId,
                post_id: postId,
            },
        });
    }
    static async unsavePost(userId, postId) {
        return await database_1.prisma.user_saved_posts.delete({
            where: {
                user_id_post_id: {
                    user_id: userId,
                    post_id: postId,
                },
            },
        });
    }
    static async getSavedPosts(userId) {
        return await database_1.prisma.user_saved_posts.findMany({
            where: { user_id: userId },
            include: {
                posts: {
                    include: postInclude
                },
            },
        });
    }
    static async createPost(data) {
        return database_1.prisma.posts.create({
            data
        });
    }
    /**
     * Buscamos por limite + 1 para comporbar si quedan mas posts.
     *
     *
     * Se usa el spread para comprobar si existe el cursor o no
     * Si existe cursor, se añade a la query,
     * y además skipeamos uno, que sería el último de la anterior query
     *
     * @param limit 	número de posts a entregar ( si hay )
     * @param user_id 	ID del usuario para filtrar posts ya vistos
     * @param cursor   created_at del último post que recibió el usuario
     * @returns
     */
    static async getFeedPosts(limit, user_id, cursor) {
        let whereClause = {
            user_id: { not: user_id },
            NOT: {
                user_viewed_posts: {
                    some: { user_id: user_id }
                }
            }
        };
        // Solo añadir el filtro de cursor si existe y es válido
        if (cursor) {
            const cursorDate = new Date(cursor);
            if (!isNaN(cursorDate.getTime())) { // Validar que sea una fecha válida
                whereClause.created_at = { lt: cursorDate };
            }
        }
        return database_1.prisma.posts.findMany({
            take: limit,
            orderBy: { created_at: "desc" },
            where: whereClause,
            include: {
                users: { select: { id: true, username: true, photo_url: true } },
                recipes: { select: { description: true, time_required: true } },
                _count: { select: { comments: true, likes: true, user_saved_posts: true } }
            }
        });
    }
    static async getPostById(id) {
        return database_1.prisma.posts.findUnique({
            where: { id },
            include: postInclude
        });
    }
    static async updatePost(id, data) {
        return database_1.prisma.posts.update({
            where: { id },
            data
        });
    }
    static async deletePost(id) {
        return database_1.prisma.posts.delete({
            where: { id },
        });
    }
    static async getUserPosts(targetUserId) {
        return database_1.prisma.posts.findMany({
            where: { user_id: targetUserId },
            orderBy: { created_at: 'desc' },
            include: postInclude
        });
    }
    /**
     * Obtener posts aleatorios ordenados por fecha más reciente
     * Para la pantalla Explorar con infinite scroll
     * @param limit Número de posts a obtener (por defecto 12)
     * @param user_id ID del usuario para filtrar posts ya vistos
     * @param cursor Fecha del último post recibido para paginación
     */
    static async getExplorePosts(limit = 12, user_id, cursor) {
        console.log('[getExplorePosts] cursor received:', cursor);
        // Validar cursor ANTES de usarlo
        let cursorDate;
        if (cursor) {
            cursorDate = new Date(cursor);
            // Validar que sea una fecha válida
            if (isNaN(cursorDate.getTime())) {
                console.warn('[getExplorePosts] Invalid cursor, ignoring:', cursor);
                cursorDate = undefined;
            }
            else {
                console.log('[getExplorePosts] Valid cursor:', cursorDate.toISOString());
            }
        }
        return database_1.prisma.posts.findMany({
            take: limit + 1, // +1 para verificar si hay más
            orderBy: { created_at: 'desc' }, // Ordenar por fecha más reciente primero
            where: {
                // Solo agregar created_at si tenemos un cursor válido
                ...(cursorDate && {
                    created_at: {
                        lt: cursorDate, // Posts anteriores al cursor
                    },
                }),
                // Excluir posts que el usuario ya ha visto
                NOT: {
                    user_viewed_posts: {
                        some: {
                            user_id: user_id
                        }
                    }
                }
            },
            include: postInclude
        });
    }
    /**
     * Obtener posts para la pantalla Inicio
     * Similar a getFeedPosts pero con toda la información necesaria
     */
    static async getHomePosts(limit, user_id, cursor) {
        return database_1.prisma.posts.findMany({
            take: limit + 1,
            orderBy: { created_at: 'desc' },
            where: {
                ...(cursor && {
                    created_at: {
                        lt: new Date(cursor),
                    },
                }),
                // Excluir posts creados por el mismo usuario
                user_id: {
                    not: user_id
                },
                // Excluir posts que el usuario ya ha visto
                NOT: {
                    user_viewed_posts: {
                        some: {
                            user_id: user_id
                        }
                    }
                }
            },
            include: postInclude
        });
    }
}
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map