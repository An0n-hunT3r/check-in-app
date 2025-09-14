export type Role = "manager" | "member";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
}

