import { prisma } from '../config/database';

const placeInclude = {
	_count: {
		select: {
			place_reviews: true, // Comentarios/reviews del lugar
		}
	},
	place_reviews: {
		select: {
			id: true,
		}
	}
};

export class PlaceService {
	/**
	 * Obtener un place por ID con toda su información
	 * Incluye: nombre, ubicación (address), tipo, tags, rating, likes, comentarios, reservas
	 */
	static async getPlaceById(id: string) {
		const place = await prisma.places.findUnique({
			where: { id },
			include: placeInclude
		});

		if (!place) {
			return null;
		}

		// Contar likes (si hay una tabla de likes para places, aquí se agregaría)
		// Por ahora, los likes pueden estar en place_reviews con rating positivo
		const likesCount = await prisma.place_reviews.count({
			where: {
				place_id: id,
				rating: {
					gt: 3.5 // Consideramos likes las reviews con rating > 3.5
				}
			}
		});

		// Contar comentarios (reviews)
		const commentsCount = place._count.place_reviews;

		// Contar reservas (si hay una tabla de reservas, aquí se agregaría)
		// Por ahora retornamos 0, pero puedes agregar una tabla de reservations después
		const reservationsCount = 0;

		return {
			...place,
			likesCount,
			commentsCount,
			reservationsCount,
		};
	}

	/**
	 * Obtener todos los places
	 */
	static async getAllPlaces() {
		return prisma.places.findMany({
			include: placeInclude
		});
	}
}

