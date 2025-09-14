import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { createCheckInSchema } from "../validators/checkinValidator";
import { createCheckIn, getAllCheckIns } from "../models/checkin";
import { randomUUID } from "crypto";
import { auth } from "../middlewares/auth";
import { logger } from "../utils/logger";

export const router = Router();

router.post("/", auth(["manager"]), validateRequest(createCheckInSchema), async (req, res) => {
  try {
    const { title, dueDate, questions } = req.body as {
      title: string;
      dueDate: Date;
      questions: { text: string }[];
    };
    
    const checkInData = {
      title,
      dueDate: new Date(dueDate).toISOString(),
      createdBy: req.user!.sub,
      createdAt: new Date().toISOString(),
      questions: questions.map((q) => ({ id: randomUUID(), text: q.text })),
    };
    
    const newCheckIn = await createCheckIn(checkInData);
    res.status(201).json(newCheckIn);
  } catch (error) {
    logger.error("Error creating check-in:", { error: (error as Error).message });
    res.status(500).json({ error: "Error occurred while creating check-in" });
  }
});

router.get("/", auth(), async (req, res) => {
  try {
    const checkIns = await getAllCheckIns();
    res.json(checkIns);
  } catch (error) {
    logger.error("Error fetching check-ins:", { error: (error as Error).message });
    res.status(500).json({ error: "Error occurred while fetching check-ins" });
  }
});

