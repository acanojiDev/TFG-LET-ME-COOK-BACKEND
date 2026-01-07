import { Request, Response } from "express";
import { createLikeSchema } from "./likes.schema";
import { LikeService } from "../../services/likes.service";
import { PostService } from "../../services/post.service";
import { UserService } from "../../services/user.service";

export class LikesController {
  /// Crear like
  static async createLike(req: Request, res: Response) {
    try {
      const validatedData = createLikeSchema.parse(req.body);

      const likeExistente = await LikeService.getLike(validatedData.user_id, validatedData.post_id)

      if (likeExistente) {
        return res.status(200).json({ message: "El like ya existia." });
      }

      const like = await LikeService.createLike(validatedData);


      res.status(201).json({
        message: "Añadido like para la publicación: " + like.post_id,
        data: like,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  /// Recoge todos los likes de un post
  static async getAllLikesOfAPost(req: Request, res: Response) {
    try {
      const { postId } = req.params;

      // Validar que postId sea un UUID válido
      const post = PostService.getPostById(postId);

      if (!post) {
        return res.status(400).json({
          error: "No existe el post",
        });
      }

      const likes = await LikeService.getAllLikesOfAPost(postId);
      res.status(200).json({ data: likes });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /// Recoge todos los likes de un user
  static async getAllLikesOfAUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      // Validar que userId sea un UUID válido
      const user = UserService.getUserById(userId);

      if (!user) {
        return res.status(400).json({
          error: "El usuario no existe",
        });
      }

      const likes = await LikeService.getAllLikesOfAUser(userId);
      res.status(200).json({ data: likes });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteLike(req: Request, res: Response) {
    try {
      const { userId, postId } = req.params;

      // Validar que userId y postId sean UUIDs válidos

      const user = UserService.getUserById(userId);

      const likeExistente = await LikeService.getLike(userId, postId)

      if (!likeExistente) {
        return res.status(200).json({ message: "El like ya no existia." });
      }

      await LikeService.deleteLike(userId, postId);

      res.status(200).json({ message: "Like eliminado exitosamente" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async userHasLikedPost(userId: string, postId: string): Promise<boolean> {
    const like = await LikeService.getLike(userId, postId);
    return !!like;
  }
}
