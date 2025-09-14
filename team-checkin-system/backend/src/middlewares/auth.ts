import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import axios from "axios";
import jwkToPem from "jwk-to-pem";
import { config } from "../config";
import type { DecodedToken } from "../types/auth";
import { logger } from "../utils/logger";

let publicKeyCache: { kid: string; pem: string } | null = null;

export function auth(requiredRoles?: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing authorization token" });
    }
    const token: string = authHeader.split(" ")[1] as string;

    try {
      if (!publicKeyCache) {
        const { data } = await axios.get(config.jwksUrl, { timeout: 5000 });
        const headerKid = ((): string | undefined => {
          try {
            const headerSegment = token.split(".")[0] ?? "";
            if (!headerSegment) return undefined;
            const headerJson = Buffer.from(headerSegment, "base64").toString("utf8");
            const header = JSON.parse(headerJson) as { kid?: string };
            return header.kid;
          } catch {
            return undefined;
          }
        })();
        const key = headerKid ? data.keys.find((k: { kid: string }) => k.kid === headerKid) : data.keys[0];
        publicKeyCache = { kid: key.kid, pem: jwkToPem(key) };
      }

      const publicKey = publicKeyCache.pem as string;
      const decoded = jwt.verify(token as string, publicKey, {
        algorithms: ["RS256"],
      }) as DecodedToken;
      if (requiredRoles && !requiredRoles.includes(decoded.role ?? "")) {
        return res.status(403).json({ error: "User does not have permission to access this resource" });
      }

      req.user = decoded;
      next();
    } catch (e) {
      logger.error("Auth token verification failed", { error: (e as Error).message });
      return res.status(401).json({ error: "Invalid authorization token" });
    }
  };
}

