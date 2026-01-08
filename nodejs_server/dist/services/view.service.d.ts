export declare class ViewService {
    /**
     * Marca un post como visto por un usuario.
     * Si ya existe el registro, actualiza la fecha de visualización.
     *
     * @param user_id ID del usuario que vio el post
     * @param post_id ID del post visto
     * @returns El registro de visualización creado o actualizado
     */
    static markPostAsViewed(user_id: string, post_id: string): Promise<{
        user_id: string;
        post_id: string;
        viewed_at: Date | null;
    }>;
    /**
     * Obtiene todos los posts vistos por un usuario
     *
     * @param user_id ID del usuario
     * @returns Lista de posts vistos con información del post
     */
    static getViewedPosts(user_id: string): Promise<({
        posts: {
            type: string;
            id: string;
            updated_at: Date | null;
            user_id: string;
            content: string | null;
            media_url: string | null;
            created_at: Date | null;
        };
    } & {
        user_id: string;
        post_id: string;
        viewed_at: Date | null;
    })[]>;
    /**
     * Verifica si un usuario ha visto un post
     *
     * @param user_id ID del usuario
     * @param post_id ID del post
     * @returns true si el usuario ha visto el post
     */
    static hasUserViewedPost(user_id: string, post_id: string): Promise<boolean>;
    /**
     * Elimina el registro de visualización de un post
     *
     * @param user_id ID del usuario
     * @param post_id ID del post
     */
    static unmarkPostAsViewed(user_id: string, post_id: string): Promise<{
        user_id: string;
        post_id: string;
        viewed_at: Date | null;
    }>;
}
//# sourceMappingURL=view.service.d.ts.map