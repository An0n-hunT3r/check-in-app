import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { randomUUID } from "crypto";
import { jwtPrivateKey, jwk } from "./keys";
import { authConfig } from "./config";
import { User, Role } from "./types";
import { logger } from "../utils/logger";
import { passwordSchema } from "../validators/responseValidator";

const app = express();
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: "Too many authentication attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const users: User[] = [];

// Signup
app.post("/signup", authLimiter, async (req, res) => {
  const { email, password, role } = req.body as { email: string; password: string; role: Role };
  
  if (!email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields: email, password, role" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  if (!["manager", "member"].includes(role)) {
    return res.status(400).json({ error: "Invalid role. Must be 'manager' or 'member'" });
  }

  const passwordValidation = passwordSchema.safeParse(password);
  if (!passwordValidation.success) {
    return res.status(400).json({ 
      error: "Password validation failed", 
      details: passwordValidation.error.issues.map((issue) => issue.message)
    });
  }

  if (users.find((u) => u.email === email)) {
    return res.status(400).json({ error: "User already exists with this email" });
  }

  try {
    const hash = await bcrypt.hash(password, 12);
    const user: User = { id: randomUUID(), email, passwordHash: hash, role };
    users.push(user);
    
    logger.info("User created successfully", { email, role });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    logger.error("Error creating user", { error: (error as Error).message });
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
app.post("/login", authLimiter, async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };
  
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = users.find((u) => u.email === email);
    if (!user) {
      // Small delay to prevent timing attacks
      await bcrypt.compare("dummy", "$2b$12$dummy.hash.to.prevent.timing.attacks");
      return res.status(401).json({ error: "Invalid credentials" });
    }
    
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role },
      jwtPrivateKey,
      { algorithm: "RS256", expiresIn: "1h", keyid: authConfig.keyId }
    );

    logger.info("User logged in successfully", { email });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (error) {
    logger.error("Error during login", { error: (error as Error).message });
    res.status(500).json({ error: "Internal server error" });
  }
});

// Public key (JWK)
app.get("/.well-known/jwks.json", (_req, res) => {
  res.json(jwk);
});

app.listen(authConfig.port, () => {
  logger.info("Auth server started", { port: authConfig.port });
});

