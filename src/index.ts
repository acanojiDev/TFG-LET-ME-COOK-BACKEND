import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './modules/users/user.routes';
import { errorHandler } from './middleware/errorHandler';
import { swaggerSpec } from './config/swagger';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/users', userRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
	res.json({ message: 'Servidor funcionando correctamente' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
	res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
	console.log(`Servidor corriendo en puerto ${PORT}`);
});
