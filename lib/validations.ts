import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }).trim(),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." })
    .max(128, { error: "Password must be 128 characters or fewer." }),
  rememberMe: z.boolean().optional(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { error: "Full name must be at least 2 characters." })
      .max(80, { error: "Full name must be 80 characters or fewer." }),
    email: z.email({ error: "Please enter a valid email address." }).trim(),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters long." })
      .max(128, { error: "Password must be 128 characters or fewer." })
      .regex(/[A-Za-z]/, { error: "Include at least one letter." })
      .regex(/[0-9]/, { error: "Include at least one number." }),
    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your password." }),
    acceptTerms: z.boolean().refine((value) => value === true, {
      error: "Please accept the Terms & Conditions and Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match.",
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email({ error: "Please enter the email registered with your account." }).trim(),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { error: "Full name must be at least 2 characters." })
    .max(100, { error: "Full name must be 100 characters or fewer." }),
  email: z.email({ error: "Please enter a valid email address." }),
  phone: z
    .string()
    .trim()
    .min(8, { error: "Please enter a valid phone number." })
    .max(20, { error: "Phone number must be 20 characters or fewer." }),
  street: z
    .string()
    .trim()
    .min(5, { error: "Please enter your street address." })
    .max(200, { error: "Street address must be 200 characters or fewer." }),
  city: z
    .string()
    .trim()
    .min(2, { error: "Please enter your city." })
    .max(80, { error: "City must be 80 characters or fewer." }),
  state: z
    .string()
    .trim()
    .min(2, { error: "Please enter your state or province." })
    .max(80, { error: "State must be 80 characters or fewer." }),
  postalCode: z
    .string()
    .trim()
    .min(4, { error: "Please enter a valid postal code." })
    .max(12, { error: "Postal code must be 12 characters or fewer." }),
  country: z
    .string()
    .trim()
    .min(2, { error: "Please enter your country." })
    .max(80, { error: "Country must be 80 characters or fewer." }),
  deliveryNotes: z
    .string()
    .trim()
    .max(300, { error: "Delivery notes must be 300 characters or fewer." })
    .optional(),
});

export type CheckoutSchemaValues = z.infer<typeof checkoutSchema>;

export const resetPasswordSchema = z
  .object({
    email: z
      .email({ error: "Please enter the email registered with your account." })
      .trim(),
    code: z
      .string()
      .trim()
      .regex(/^\d{6}$/, { error: "Enter the 6-digit verification code." }),
    newPassword: z
      .string()
      .min(8, { error: "Password must be at least 8 characters long." })
      .max(128, { error: "Password must be 128 characters or fewer." })
      .regex(/[A-Za-z]/, { error: "Include at least one letter." })
      .regex(/[0-9]/, { error: "Include at least one number." }),
    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your new password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    error: "Passwords do not match.",
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const googleDemoAuthSchema = z.object({
  preset: z.enum(["aarav", "priya"]).optional(),
  name: z
    .string()
    .trim()
    .min(2, { error: "Full name must be at least 2 characters." })
    .max(80, { error: "Full name must be 80 characters or fewer." })
    .optional(),
  email: z.email({ error: "Please enter a valid Google email address." }).trim().optional(),
});

export const createOrderPayloadSchema = z.object({
  ...checkoutSchema.shape,
  paymentMethod: z.enum([
    "UPI",
    "Credit Card",
    "Debit Card",
    "Cash on Delivery",
  ]),
  couponCode: z.string().trim().max(32).optional(),
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1, { error: "Your cart is empty." }),
});
