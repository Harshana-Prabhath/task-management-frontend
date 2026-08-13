import { z, ZodError } from "zod";


const LETTERS_ONLY = /^[\p{L}\s]+$/u;

export const nameSchema = z
  .string()
  .trim()
  .min(1, "Full name is required")
  .max(100, "Full name cannot exceed 100 characters")
  .regex(LETTERS_ONLY, "Full name can only contain letters and spaces");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Please enter a valid email address");


export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

export const roleSchema = z.enum(["User", "Admin"]);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export const prioritySchema = z.enum(["Low", "Medium", "High"]);
export const statusSchema = z.enum(["Open", "In Progress", "Testing", "Done"]);

export const taskSchema = z.object({
  id: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string().trim().min(1, "Description is required"),
  priority: prioritySchema,
  status: statusSchema,
  dueDate: z.string().min(1, "Due date is required"),
  assignee: z.string(),
});

export type TaskInput = z.infer<typeof taskSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const getFieldErrors = (error: ZodError): Record<string, string> => {
  const errors: Record<string, string> = {};
  error.issues.forEach((issue) => {
    if (issue.path[0]) {
      errors[issue.path[0].toString()] = issue.message;
    }
  });
  return errors;
};