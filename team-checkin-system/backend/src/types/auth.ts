import type { JwtPayload } from "jsonwebtoken";

export type DecodedToken = JwtPayload & {
  sub: string;
  role?: string;
  email?: string;
};

