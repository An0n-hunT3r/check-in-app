import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { createCheckInSchema } from "../validators/checkinValidator";
import { checkIns, CheckIn } from "../models/checkin";
import { randomUUID } from "crypto";
import { auth } from "../middlewares/auth";

export const router = Router();

router.post("/", auth(["manager"]), validateRequest(createCheckInSchema), (req, res) => {
  const { title, dueDate, questions } = req.body as {
    title: string;
    dueDate: Date;
    questions: { text: string }[];
  };
  const newCheckIn: CheckIn = {
    id: randomUUID(),
    title,
    dueDate: new Date(dueDate).toISOString(),
    createdBy: req.user!.sub,
    createdAt: new Date().toISOString(),
    questions: questions.map((q) => ({ id: randomUUID(), text: q.text })),
  };
  checkIns.push(newCheckIn);
  res.status(201).json(newCheckIn);
});

router.get("/", auth(), (req, res) => {
  return res.json(checkIns);
});

