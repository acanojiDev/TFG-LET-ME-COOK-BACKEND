"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViewService = void 0;
const database_1 = require("../config/database");
class ViewService {
    /**
     * Marca un post como visto por un usuario.
     * Si ya existe el registro, actualiza la fecha de visualización.
     *
     * @param user_id ID del usuario que vio el post
     * @param post_id ID del post visto
     * @returns El registro de visualización creado o actualizado
     */
    static async markPostAsViewed(user_id, post_id) {
        return database_1.prisma.user_viewed_posts.upsert({
            where: {
                user_id_post_id: {
                    user_id: user_id,
                    post_id: post_id
                }
            },
            update: {
                viewed_at: new Date()
            },
            create: {
                user_id: user_id,
                post_id: post_id
            }
        });
    }
    /**
     * Obtiene todos los posts vistos por un usuario
     *
     * @param user_id ID del usuario
     * @returns Lista de posts vistos con información del post
     */
    static async getViewedPosts(user_id) {
        return database_1.prisma.user_viewed_posts.findMany({
            where: {
                user_id: user_id
            },
            include: {
                posts: true
            },
            orderBy: {
                viewed_at: 'desc'
            }
        });
    }
    /**
     * Verifica si un usuario ha visto un post
     *
     * @param user_id ID del usuario
     * @param post_id ID del post
     * @returns true si el usuario ha visto el post
     */
    static async hasUserViewedPost(user_id, post_id) {
        const view = await database_1.prisma.user_viewed_posts.findUnique({
            where: {
                user_id_post_id: {
                    user_id: user_id,
                    post_id: post_id
                }
            }
        });
        return view !== null;
    }
    /**
     * Elimina el registro de visualización de un post
     *
     * @param user_id ID del usuario
     * @param post_id ID del post
     */
    static async unmarkPostAsViewed(user_id, post_id) {
        return database_1.prisma.user_viewed_posts.delete({
            where: {
                user_id_post_id: {
                    user_id: user_id,
                    post_id: post_id
                }
            }
        });
    }
}
exports.ViewService = ViewService;
//# sourceMappingURL=view.service.js.map