import { CreatePostInput, UpdatePostInput } from '../modules/posts/post.schema';
export declare class PostService {
    static savePost(userId: string, postId: string): Promise<{
        user_id: string;
        post_id: string;
    }>;
    static unsavePost(userId: string, postId: string): Promise<{
        user_id: string;
        post_id: string;
    }>;
    static getSavedPosts(userId: string): Promise<({
        posts: {
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
        } & {
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
    })[]>;
    static createPost(data: CreatePostInput): Promise<{
        type: string;
        id: string;
        updated_at: Date | null;
        user_id: string;
        content: string | null;
        media_url: string | null;
        created_at: Date | null;
    }>;
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
    static getFeedPosts(limit: number, user_id: string, cursor?: string): Promise<({
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
    } & {
        type: string;
        id: string;
        updated_at: Date | null;
        user_id: string;
        content: string | null;
        media_url: string | null;
        created_at: Date | null;
    })[]>;
    static getPostById(id: string): Promise<({
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
    } & {
        type: string;
        id: string;
        updated_at: Date | null;
        user_id: string;
        content: string | null;
        media_url: string | null;
        created_at: Date | null;
    }) | null>;
    static updatePost(id: string, data: UpdatePostInput): Promise<{
        type: string;
        id: string;
        updated_at: Date | null;
        user_id: string;
        content: string | null;
        media_url: string | null;
        created_at: Date | null;
    }>;
    static deletePost(id: string): Promise<{
        type: string;
        id: string;
        updated_at: Date | null;
        user_id: string;
        content: string | null;
        media_url: string | null;
        created_at: Date | null;
    }>;
    static getUserPosts(targetUserId: string): Promise<({
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
    } & {
        type: string;
        id: string;
        updated_at: Date | null;
        user_id: string;
        content: string | null;
        media_url: string | null;
        created_at: Date | null;
    })[]>;
    /**
     * Obtener posts aleatorios ordenados por fecha más reciente
     * Para la pantalla Explorar con infinite scroll
     * @param limit Número de posts a obtener (por defecto 12)
     * @param user_id ID del usuario para filtrar posts ya vistos
     * @param cursor Fecha del último post recibido para paginación
     */
    static getExplorePosts(limit: number | undefined, user_id: string, cursor?: string): Promise<({
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
    } & {
        type: string;
        id: string;
        updated_at: Date | null;
        user_id: string;
        content: string | null;
        media_url: string | null;
        created_at: Date | null;
    })[]>;
    /**
     * Obtener posts para la pantalla Inicio
     * Similar a getFeedPosts pero con toda la información necesaria
     */
    static getHomePosts(limit: number, user_id: string, cursor?: string): Promise<({
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
    } & {
        type: string;
        id: string;
        updated_at: Date | null;
        user_id: string;
        content: string | null;
        media_url: string | null;
        created_at: Date | null;
    })[]>;
}
//# sourceMappingURL=post.service.d.ts.map