import "express";
import type { DecodedToken } from "./auth";

declare module "express-serve-static-core" {
  interface Request {
    user?: DecodedToken;
  }
}

