import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'API de Usuarios',
			version: '1.0.0',
			description: 'Documentación de la API de usuarios',
			contact: {
				name: 'API Support',
			},
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Servidor de desarrollo',
			},
		],
		components: {
			schemas: {
				User: {
					type: 'object',
					properties: {
						id: {
							type: 'integer',
						},
						username: {
							type: 'string',
						},
						email: {
							type: 'string',
							format: 'email',
						},
						bio: {
							type: 'string',
						},
						photo_url: {
							type: 'string',
						},
						location: {
							type: 'string',
						},
						registered_at: {
							type: 'string',
							format: 'date-time',
						},
						updated_at: {
							type: 'string',
							format: 'date-time',
						},
					},
				},
			},
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		tags: [
			{
				name: 'Users',
				description: 'Gestión de usuarios',
			},
		],
	},
	apis: [path.join(__dirname, '../modules/**/*.routes.ts')],
};

export const swaggerSpec = swaggerJsdoc(options);
