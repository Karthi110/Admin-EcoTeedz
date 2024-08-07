import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email({
    message: "must be a valid email",
  }),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  modile: z.string().min(5, {
    message: "Modile must atleat be valid",
  }),
});

export const productSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  comparePrice: z.string().optional(),
  price: z.string().min(2, {
    message: "Provide the cost of the product.",
  }),
  inventory: z.string().min(1, {
    message: "Inventory must not be 0.",
  }),
});
