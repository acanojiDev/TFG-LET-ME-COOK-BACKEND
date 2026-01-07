import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import userRoutes from './modules/users/user.routes';
import postRoutes from './modules/posts/post.routes';
import likesRoutes from './modules/likes/likes.routes';
import commentRoutes from './modules/comments/comments.routes';

import { errorHandler } from './middleware/errorHandler';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';
import { createApolloServer, getApolloMiddleware } from './graphql';

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Rutas REST (se mantienen intactas y funcionando)
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/likes', likesRoutes);
app.use('/api/comments', commentRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
	res.json({ message: 'Servidor funcionando correctamente' });
});

// Iniciar servidor
async function startServer() {
	try {
		// Inicializar Apollo Server antes de iniciar Express
		const apolloServer = await createApolloServer();
		
		// Integrar Apollo Server como middleware de Express
		// Se agrega después de las rutas REST pero antes del error handler
		// para que GraphQL pueda manejar sus propios errores correctamente
		app.use('/graphql', getApolloMiddleware(apolloServer));

		// Manejo de rutas no encontradas (solo para rutas que no sean GraphQL)
		app.use((req, res, next) => {
			// Si la ruta es /graphql, no manejarla aquí (dejarla para Apollo Server)
			if (req.path === '/graphql') {
				return next();
			}
			res.status(404).json({ error: 'Ruta no encontrada' });
		});

		// Manejo de errores (después de GraphQL para que GraphQL maneje sus propios errores)
		app.use(errorHandler);

		// Iniciar el servidor Express
		app.listen(PORT, () => {
			console.log(`✅ Servidor corriendo en puerto ${PORT}`);
			console.log(`📚 Swagger UI disponible en http://localhost:${PORT}/api-docs`);
			console.log(`🔷 GraphQL endpoint disponible en http://localhost:${PORT}/graphql`);
			console.log(`🌐 Rutas REST disponibles en http://localhost:${PORT}/api/*`);
		});
	} catch (error) {
		console.error('❌ Error al iniciar el servidor:', error);
		process.exit(1);
	}
}

startServer();
