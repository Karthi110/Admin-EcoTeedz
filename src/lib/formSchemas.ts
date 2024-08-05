import { z } from "zod";

export const FormSchema = z.object({
  email: z.string().email({
    message: "Username must be at least 2 characters.",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  modile: z.string().min(2, {
    message: "Modile must be at least 2 characters.",
  }),
});
