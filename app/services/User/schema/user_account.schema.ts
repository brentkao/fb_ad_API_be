import { user_account_status } from "@prisma/client";
import { z } from "zod";

export const userAccountSchema = z.object({
  uid: z.number().min(3000000, "Uid must be bigger than 3000000"),
  cid: z.number().min(1000000, "Cid must be bigger than 1000000"),
  username: z.string().min(5, "Username must be at least 5 characters long"),
  email: z.string().email("Invalid email").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  salt: z.string(),
  status: z.nativeEnum(user_account_status),
  create_at: z.date(),
  update_at: z.date(),
});

export const registerUserAccountSchema = userAccountSchema.pick({
  cid: true,
  email: true,
  username: true,
  password: true,
});

export type RegisterUserAccountSchema = z.infer<
  typeof registerUserAccountSchema
>;

export const loginUserAccountSchema = userAccountSchema.pick({
  email: true,
  password: true,
});

export type LoginUserAccountSchema = z.infer<
  typeof loginUserAccountSchema
>;


export const resUserAccountSchema = userAccountSchema.pick({
  email: true,
  username: true,
});

export type ResUserAccountSchema = z.infer<
  typeof resUserAccountSchema
>;