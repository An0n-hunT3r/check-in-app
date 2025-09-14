import { z } from "zod";

export const createResponseSchema = z.object({
  checkInId: z.string().min(1, "checkInId is required"),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1, "questionId is required"),
        answer: z.string().min(1, "answer cannot be empty"),
      })
    )
    .min(1, "answers must have at least one item")
});

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

