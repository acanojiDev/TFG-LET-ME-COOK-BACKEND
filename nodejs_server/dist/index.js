"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
const graphql_1 = require("./graphql");
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3000', 10);
const NODE_ENV = process.env.NODE_ENV || 'development';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
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
        const apolloServer = await (0, graphql_1.createApolloServer)();
        app.use('/graphql', (0, graphql_1.getApolloMiddleware)(apolloServer));
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
    }
    catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}
startServer();
exports.default = app;
//# sourceMappingURL=index.js.map