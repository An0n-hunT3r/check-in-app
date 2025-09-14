import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error("Error while processing request", { err });
  const anyErr = err as { status?: number; message?: string };
  const status = anyErr.status || 500;
  const message = anyErr.message || "Internal Server Error";
  res.status(status).json({ error: message });
};

