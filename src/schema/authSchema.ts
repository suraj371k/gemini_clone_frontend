import { z } from "zod";

export const phoneSchema = z.object({
  country: z.string().min(1, "Select a country"),
  dialCode: z.string().min(1, "Dial code required"),
  phone: z
    .string()
    .min(4, "Phone looks too short")
    .max(15, "Phone looks too long")
    .regex(/^\d+$/, "Phone must contain only digits"),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .min(4, "Enter the OTP")
    .max(6, "OTP too long")
    .regex(/^\d+$/, "OTP must be numeric"),
});

export const signupSchema = phoneSchema.extend({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
});
