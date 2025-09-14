import { Router } from "express";
import { getResponsesByCheckInId, getResponsesByUserId, getAllResponses } from "../models/response";
import { getAllCheckIns } from "../models/checkin";
import { auth } from "../middlewares/auth";
import { logger } from "../utils/logger";

export const router = Router();

/**
 * Get all responses for a check-in
 */
router.get("/checkin/:checkInId", auth(["manager"]), async (req, res) => {
  try {
    const { checkInId } = req.params as { checkInId: string };
    const responses = await getResponsesByCheckInId(checkInId);
    res.json({ checkInId, count: responses.length, responses });
  } catch (error) {
    logger.error("Error occurred while fetching check-in responses:", { error: (error as Error).message });
    res.status(500).json({ error: "Error occurred while fetching check-in responses" });
  }
});

/**
 * Get all responses by a specific user for any check-in
 */
router.get("/checkin/user/:userId", auth(["manager"]), async (req, res) => {
  try {
    const { userId } = req.params as { userId: string };
    const responses = await getResponsesByUserId(userId);
    res.json({ userId, count: responses.length, responses });
  } catch (error) {
    logger.error("Error fetching user responses:", { error: (error as Error).message });
    res.status(500).json({ error: "Error occurred while fetching user responses" });
  }
});

/**
 * Get summary of all check-ins and their responses
 */
router.get("/summary", auth(["manager"]), async (_req, res) => {
  try {
    const [checkIns, allResponses] = await Promise.all([
      getAllCheckIns(),
      getAllResponses()
    ]);
    
    const summary = checkIns.map((checkIn) => {
      const checkInResponses = allResponses.filter((r) => r.checkInId === checkIn.id);
      return {
        checkIn,
        count: checkInResponses.length,
        responses: checkInResponses,
      };
    });
    
    res.json({ totalCheckIns: checkIns.length, summary });
  } catch (error) {
    logger.error("Error fetching summary:", { error: (error as Error).message });
    res.status(500).json({ error: "Error occurred while fetching summary" });
  }
});

