import { Request, Response, NextFunction } from 'express';
/**
 * Middleware de manejo de errores global para Express
 * Captura todos los errores y los formatea de manera consistente
 */
export declare function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
//# sourceMappingURL=errorHandler.d.ts.map