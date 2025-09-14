import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { createResponseSchema } from "../validators/responseValidator";
import { responses, ResponseEntry } from "../models/response";
import { randomUUID } from "crypto";
import { auth } from "../middlewares/auth";

export const router = Router();

/**
 * Submit a response (member only)
 */
router.post("/", auth(["member"]), validateRequest(createResponseSchema), (req, res) => {
  const { checkInId, answers } = req.body as {
    checkInId: string;
    answers: { questionId: string; answer: string }[];
  };

  const userId = req.user!.sub as string;

  // prevent duplicate
  const existing = responses.find((r) => r.checkInId === checkInId && r.userId === userId);
  if (existing) {
    return res.status(400).json({ error: "Response already submitted for this check-in" });
  }

  const newResponse: ResponseEntry = {
    id: randomUUID(),
    checkInId,
    userId,
    createdAt: new Date().toISOString(),
    answers,
  };

  responses.push(newResponse);
  res.status(201).json(newResponse);
});

/**
 * View my responses (member)
 */
router.get("/me", auth(["member"]), (req, res) => {
  const userId = req.user!.sub as string;
  const myResponses = responses.filter((r) => r.userId === userId);
  res.json(myResponses);
});

