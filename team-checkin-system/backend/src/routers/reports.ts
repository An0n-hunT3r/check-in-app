import { Router } from "express";
import { responses } from "../models/response";
import { checkIns } from "../models/checkin";
import { auth } from "../middlewares/auth";

export const router = Router();

/**
 * Get all responses for a check-in
 */
router.get("/checkin/:checkInId", auth(["manager"]), (req, res) => {
  const { checkInId } = req.params as { checkInId: string };
  const filtered = responses.filter((r) => r.checkInId === checkInId);
  res.json({ checkInId, count: filtered.length, responses: filtered });
});

/**
 * Get all responses by a specific user for any check-in
 */
router.get("/checkin/user/:userId", auth(["manager"]), (req, res) => {
  const { userId } = req.params as { userId: string };
  const filtered = responses.filter((r) => r.userId === userId);
  res.json({ userId, count: filtered.length, responses: filtered });
});

/**
 * Get summary of all check-ins and their responses
 */
router.get("/summary", auth(["manager"]), (_req, res) => {
  const summary = checkIns.map((c) => ({
    checkIn: c,
    count: responses.filter((r) => r.checkInId === c.id).length,
    responses: responses.filter((r) => r.checkInId === c.id),
  }));
  res.json({ totalCheckIns: checkIns.length, summary });
});

