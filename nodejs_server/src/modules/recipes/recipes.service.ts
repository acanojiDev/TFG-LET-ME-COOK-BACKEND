import { prisma } from "../../config/database";
import { CreateRecipeInput, UpdateRecipeInput } from "./recipes.schema";
import { Prisma } from "@prisma/client";

export class RecipeService {
	static async createRecipe(data: CreateRecipeInput) {
		const { ingredients, ...recipeData } = data;

		return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
			const recipe = await tx.recipes.create({
				data: recipeData,
			});

			if (ingredients && ingredients.length > 0) {
				for (const ing of ingredients) {
					let ingredient = await tx.ingredients.findUnique({
						where: { name: ing.ingredient_name }
					});

					if (!ingredient) {
						ingredient = await tx.ingredients.create({
							data: {
								name: ing.ingredient_name,
								unit: ing.unit
							}
						})
					}

					await tx.recipe_ingredients.create({
						data: {
							recipe_id: recipe.id,
							ingredient_id: ingredient.id,
							quantity: ing.quantity,
						},
					});
				}
			}
			return recipe;
		});
	}

	static async getRecipeById(id: string) {
		return await prisma.recipes.findUnique({
			where: { id },
			include: {
				recipe_ingredients: {
					include: {
						ingredients: true
					}
				},
				posts: {
					select: {
						id: true,
						media_url: true,
						users: {
							select: {
								id: true,
								username: true,
								photo_url: true
							}
						}
					}
				}
			},
		});
	}

	static async updateRecipe(id: string, data: UpdateRecipeInput) {
		return await prisma.recipes.update({
			where: { id },
			data,
		});
	}

	static async deleteRecipe(id: string) {
		return await prisma.recipes.delete({
			where: { id },
		});
	}
}
