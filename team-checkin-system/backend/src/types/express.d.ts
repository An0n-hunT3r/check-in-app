import type { DecodedToken } from "./auth";

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken;
    }
  }
}

