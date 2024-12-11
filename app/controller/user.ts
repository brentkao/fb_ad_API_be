import { Request, Response } from "express";
import { prisma } from "../prisma";
import { UserAccount } from "@prisma/client";
import { z } from "zod";
import { ulid } from "ulid";
import bcrypt from "bcryptjs";

import BadRequestError from "../errors/bad-request-error";
import { formatZodValidationErrors } from "../util/zod";

import { registerUserAccountSchema } from "../services/User/schema/user_account.schema";

/**
 * @swagger
 * /api/user/register:
 *   post:
 *     tags:
 *       - user
 *     summary: Register a new user account
 *     description: Allows new user to register an account by providing their details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cid:
 *                  type: number
 *                  example: 1000000
 *               email:
 *                  type: string
 *                  example: "user@example.com"
 *               username:
 *                  type: string
 *                  example: "First"
 *               password:
 *                  type: string
 *                  example: "password123"
 *     responses:
 *       200:
 *         description: Successfully registered the user account.
 *       400:
 *         description: Invalid request data.
 */
export async function register(req: Request, res: Response) {
  const result = registerUserAccountSchema.safeParse(req.body);
  if (!result.success)
    throw new BadRequestError({
      context: formatZodValidationErrors(result.error),
    });
  const { cid, email, username, password } = result.data;

  // 思考如何驗證 cid

  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);

  // 使用鹽對密碼進行哈希
  const hashedPassword = await bcrypt.hash(password, salt);
  const userData = {
    cid,
    email,
    username,
    password: hashedPassword,
    salt: salt,
  };
  console.log("userData", userData);

  const createResult = await prisma.userAccount.create({
    data: userData,
  });

  const resData = {
    uid: createResult.uid,
    createTime: createResult.create_at,
  };

  return res.status(200).json({ message: "Registered", data: resData });
}

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     tags:
 *       - user
 *     summary: Login user account
 *     description: Login user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                  type: string
 *                  example: "user@example.com"
 *               password:
 *                  type: string
 *                  example: "password123"
 *     responses:
 *       200:
 *         description: Successfully login the user account.
 *       400:
 *         description: Invalid request data.
 */
export async function login(req: Request, res: Response) {
  const result = z
    .object({
      email: z.string().email("Invalid email").min(1, "Email is required"),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long"),
    })
    .safeParse(req.body);
  if (!result.success)
    throw new BadRequestError({
      context: formatZodValidationErrors(result.error),
    });
  const { email, password } = result.data;

  // 取得帳號
  const createResult = await prisma.userAccount.findMany({
    where: {
      email,
    },
  });

  if (createResult.length <= 0) {
    throw new BadRequestError({
      message: "Invalid email or password",
    });
  }

  //確認密碼
  //step compare password
  let userData = {} as UserAccount;
  createResult.forEach((user) => {
    const match = bcrypt.compare(password, user.password);
    if (!match) {
      throw new BadRequestError({
        message: "Invalid email or password",
      });
    } else {
      userData = user;
    }
  });

  const resData = {
    uid: userData.uid,
    cid: userData.cid,
    username: userData.username,
    create_at: userData.create_at,
  };

  return res.status(200).json({ message: "Login Successfully", data: resData });
}

/**
 * @swagger
 * /api/user/logout:
 *   get:
 *     tags:
 *       - user
 *     summary: Logout user account
 *     description: Logout user account.
 *     responses:
 *       200:
 *         description: Successfully logout the user account.
 *       400:
 *         description: Invalid request data.
 */
export async function logout(req: Request, res: Response) {
  console.log("logout");
  //! 清除 cookie
  return res.status(200).json({ message: "doing something..." });
}

export async function doSomething(req: Request, res: Response) {
  return res.status(200).json({ message: "doing something..." });
}
