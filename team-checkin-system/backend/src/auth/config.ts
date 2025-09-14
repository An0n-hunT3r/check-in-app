import { z } from "zod";

const EnvSchema = z.object({
  AUTH_PORT: z.string().optional(),
  AUTH_KEY_ID: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env);
const env = parsed.success ? parsed.data : {};

export const authConfig = {
  port: Number(env.AUTH_PORT ?? 3001),
  keyId: env.AUTH_KEY_ID ?? "team-checkin-system-auth-key",
};

