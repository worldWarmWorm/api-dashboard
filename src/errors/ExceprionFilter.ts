import { NextFunction, Request, Response } from "express";
import { LoggerService } from "../logger/LoggerService";
import { HttpError } from "./HttpError";
import { IExceptionFilter } from "./IExceptionFilter";

export class ExceprionFilter implements IExceptionFilter {
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
  }

  catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction) {
    if (err instanceof HttpError) {
      this.logger.error(`[${err.context}] Error ${err.statusCode}: ${err.message}`);
      res.status(err.statusCode).send({err: err.message});
    } else {
      this.logger.error(`Error: ${err.message}`);
      res.status(500).send({err: err.message});
    }
  }
}