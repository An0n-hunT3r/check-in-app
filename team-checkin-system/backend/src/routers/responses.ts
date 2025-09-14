import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { createResponseSchema } from "../validators/responseValidator";
import { createResponse, getResponsesByUserId, getResponseByUserAndCheckIn } from "../models/response";
import { auth } from "../middlewares/auth";
import { logger } from "../utils/logger";

export const router = Router();

/**
 * Submit a response (member only)
 */
router.post("/", auth(["member"]), validateRequest(createResponseSchema), async (req, res) => {
  try {
    const { checkInId, answers } = req.body as {
      checkInId: string;
      answers: { questionId: string; answer: string }[];
    };

    const userId = req.user!.sub as string;

    const existing = await getResponseByUserAndCheckIn(userId, checkInId);
    if (existing) {
      return res.status(400).json({ error: "Response already submitted for this check-in" });
    }

    const responseData = {
      checkInId,
      userId,
      createdAt: new Date().toISOString(),
      answers,
    };

    const newResponse = await createResponse(responseData);
    res.status(201).json(newResponse);
  } catch (error) {
    logger.error("Error occurred while creating response:", { error: (error as Error).message });
    res.status(500).json({ error: "Error occurred while creating response" });
  }
});

/**
 * View my responses (member)
 */
router.get("/me", auth(["member"]), async (req, res) => {
  try {
    const userId = req.user!.sub as string;
    const myResponses = await getResponsesByUserId(userId);
    res.json(myResponses);
  } catch (error) {
    logger.error("Error occurred while fetching user responses:", { error: (error as Error).message });
    res.status(500).json({ error: "Error occurred while fetching responses" });
  }
});

