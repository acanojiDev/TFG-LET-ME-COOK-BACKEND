import { Request, Response, NextFunction } from "express";
import { RecipeService } from "./recipes.service";
import { createRecipeSchema, updateRecipeSchema } from "./recipes.schema";

export class RecipeController {
	static async create(req: Request, res: Response, next: NextFunction) {
		try {
			const data = createRecipeSchema.parse(req.body);
			const recipe = await RecipeService.createRecipe(data);
			res.json(recipe);
		} catch (error) {
			next(error);
		}
	}

	static async get(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const recipe = await RecipeService.getRecipeById(id);
			if (!recipe) {
				return res.status(404).json({ message: "Recipe not found" });
			}
			res.json(recipe);
		} catch (error) {
			next(error);
		}
	}

	static async update(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			const data = updateRecipeSchema.parse(req.body);
			const recipe = await RecipeService.updateRecipe(id, data);
			res.json(recipe);
		} catch (error) {
			next(error);
		}
	}

	static async delete(req: Request, res: Response, next: NextFunction) {
		try {
			const { id } = req.params;
			await RecipeService.deleteRecipe(id);
			res.status(204).send();
		} catch (error) {
			next(error);
		}
	}
}
