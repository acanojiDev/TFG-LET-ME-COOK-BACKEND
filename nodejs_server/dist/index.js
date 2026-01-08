"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const post_routes_1 = __importDefault(require("./modules/posts/post.routes"));
const likes_routes_1 = __importDefault(require("./modules/likes/likes.routes"));
const comments_routes_1 = __importDefault(require("./modules/comments/comments.routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const swagger_1 = require("./config/swagger");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const graphql_1 = require("./graphql");
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
// Swagger
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// Middlewares básicos
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check para plataformas de deploy
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Rutas REST (se mantienen intactas y funcionando)
app.use('/api/users', user_routes_1.default);
app.use('/api/posts', post_routes_1.default);
app.use('/api/likes', likes_routes_1.default);
app.use('/api/comments', comments_routes_1.default);
// Ruta de prueba
app.get('/', (req, res) => {
    res.json({
        message: 'Servidor funcionando correctamente',
        environment: NODE_ENV,
        timestamp: new Date().toISOString()
    });
});
// Iniciar servidor
async function startServer() {
    try {
        // Inicializar Apollo Server antes de iniciar Express
        const apolloServer = await (0, graphql_1.createApolloServer)();
        // Integrar Apollo Server como middleware de Express
        // Se agrega después de las rutas REST pero antes del error handler
        // para que GraphQL pueda manejar sus propios errores correctamente
        app.use('/graphql', (0, graphql_1.getApolloMiddleware)(apolloServer));
        // Manejo de rutas no encontradas (solo para rutas que no sean GraphQL)
        app.use((req, res, next) => {
            // Si la ruta es /graphql, no manejarla aquí (dejarla para Apollo Server)
            if (req.path === '/graphql') {
                return next();
            }
            res.status(404).json({ error: 'Ruta no encontrada' });
        });
        // Manejo de errores (después de GraphQL para que GraphQL maneje sus propios errores)
        app.use(errorHandler_1.errorHandler);
        // Iniciar el servidor Express
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`✅ Servidor corriendo en puerto ${PORT}`);
            console.log(`🔧 Ambiente: ${NODE_ENV}`);
            console.log(`📚 Swagger UI disponible en http://localhost:${PORT}/api-docs`);
            console.log(`🔷 GraphQL endpoint disponible en http://localhost:${PORT}/graphql`);
            console.log(`🌐 Rutas REST disponibles en http://localhost:${PORT}/api/*`);
            console.log(`❤️  Health check disponible en http://localhost:${PORT}/health`);
        });
        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('📴 SIGTERM recibido, cerrando servidor gracefully...');
            server.close(() => {
                console.log('✅ Servidor cerrado');
                process.exit(0);
            });
        });
        process.on('SIGINT', () => {
            console.log('📴 SIGINT recibido, cerrando servidor gracefully...');
            server.close(() => {
                console.log('✅ Servidor cerrado');
                process.exit(0);
            });
        });
    }
    catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map