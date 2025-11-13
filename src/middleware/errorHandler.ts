import {Request, Response, NextFunction, response} from 'express';

export const errorHandler = (
	err: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(err);
	res.status(500).json({error: 'Error del servidor'});
};
