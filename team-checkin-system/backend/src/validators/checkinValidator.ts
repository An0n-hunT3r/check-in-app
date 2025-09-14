import { z } from "zod";

export const createCheckInSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  dueDate: z.coerce.date(),
  questions: z
    .array(
      z.object({
        text: z.string().min(3, "Question text must be at least 3 characters long"),
      })
    )
    .nonempty("questions must have at least one item")
});

