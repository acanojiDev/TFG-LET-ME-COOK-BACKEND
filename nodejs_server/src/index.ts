import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { createApolloServer, getApolloMiddleware } from './graphql';

const app: Express = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
	res.json({
		message: 'Servidor funcionando correctamente',
		environment: NODE_ENV,
		timestamp: new Date().toISOString()
	});
});

async function startServer() {
	try {
		const apolloServer = await createApolloServer();
		app.use('/graphql', getApolloMiddleware(apolloServer));

		app.use((req, res, next) => {
			if (req.path === '/graphql') {
				return next();
			}
			res.status(404).json({ error: 'Ruta no encontrada' });
		});

		const server = app.listen(PORT, '0.0.0.0', () => {
			console.log(`Servidor corriendo en puerto ${PORT}`);
			console.log(`Ambiente: ${NODE_ENV}`);
			console.log(`GraphQL endpoint disponible en http://localhost:${PORT}/graphql`);
			console.log(`Health check disponible en http://localhost:${PORT}/health`);
		});

		process.on('SIGTERM', () => {
			console.log('SIGTERM recibido, cerrando servidor gracefully...');
			server.close(() => {
				console.log('Servidor cerrado');
				process.exit(0);
			});
		});

		process.on('SIGINT', () => {
			console.log('SIGINT recibido, cerrando servidor gracefully...');
			server.close(() => {
				console.log('Servidor cerrado');
				process.exit(0);
			});
		});

	} catch (error) {
		console.error('❌ Error al iniciar el servidor:', error);
		process.exit(1);
	}
}

startServer();

export default app;
