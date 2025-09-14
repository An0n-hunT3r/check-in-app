import { z } from "zod";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().optional(),
  AUTH_PORT: z.string().optional(),
  JWKS_URL: z.string().url().optional(),
  CORS_ORIGINS: z.string().optional(),
  DYNAMO_ENDPOINT: z.string().url().optional(),
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

export const config = {
  nodeEnv: env.NODE_ENV,
  port: Number(env.PORT ?? 4000),
  authPort: Number(env.AUTH_PORT ?? 3001),
  jwksUrl: env.JWKS_URL ?? "http://auth:3001/.well-known/jwks.json",
  corsOrigins: (env.CORS_ORIGINS || "http://localhost:3000").split(",").map((o) => o.trim()),
  dynamodb: {
    endpoint: env.DYNAMO_ENDPOINT ?? "http://localhost:4566",
    region: env.AWS_REGION ?? "us-east-1",
    accessKeyId: env.AWS_ACCESS_KEY_ID ?? "ddb_access_id",
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY ?? "ddb_secret_key",
  },
};

