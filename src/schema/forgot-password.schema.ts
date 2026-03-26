import { object, string } from "zod";

export const forgotPasswordSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
});
