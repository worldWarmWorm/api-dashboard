import { IMiddleware } from '../interfaces/IMiddleware';
import { NextFunction, Request, Response } from 'express';

export class AuthGuardMiddleware implements IMiddleware {
	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.user) {
			return next();
		}
		res.status(401).send({ error: "You ain't authorized" });
	}
}
