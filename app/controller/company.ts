import { Request, Response } from "express";
import { prisma } from "../prisma";
import { z } from "zod";
import { ulid } from "ulid";
import bcrypt from "bcryptjs";

import BadRequestError from "../errors/bad-request-error";
import { formatZodValidationErrors } from "../util/zod";

import { registerCompanySchema } from "../services/Company/schema/company.schema";
import { resUserAccountSchema } from "../services/User/schema/user_account.schema";

/**
 * @swagger
 * /api/company/register:
 *   post:
 *     tags:
 *       - company
 *     summary: Register a new company account
 *     description: Allows new company to register an account by providing their details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                  type: string
 *                  example: "ParaZeni Studio"
 *     responses:
 *       200:
 *         description: Successfully registered the user account.
 *       400:
 *         description: Invalid request data.
 */
export async function register(req: Request, res: Response) {
  const result = registerCompanySchema.safeParse(req.body);
  if (!result.success)
    throw new BadRequestError({
      context: formatZodValidationErrors(result.error),
    });
  const { name } = result.data;

  const companyData = {
    name,
  };

  const createResult = await prisma.company.create({
    data: companyData,
  });
  console.log("createResult", createResult);

  const resData = {
    cid: createResult.cid,
    create_at: createResult.create_at,
  };

  return res.status(200).json({ message: "Registered", data: resData });
}

/**
 * @swagger
 * /api/company:
 *   get:
 *     tags:
 *       - company
 *     summary: Get company infomation
 *     description: Get company infomation details.
 *     requestBody:
 *     responses:
 *       200:
 *         description: Successfully registered the user account.
 *       400:
 *         description: Invalid request data.
 */
export async function getCompany(req: Request, res: Response) {
  const user = req.session.user;

  const cid = user?.cid; // get form express-session

  const companyData = await prisma.company.findUnique({
    where: {
      cid,
    },
    select: {
      name: true,
      project: {
        select: {
          pid: true,
          name: true,
        },
      },
    },
  });
  console.log("companyData", companyData);
  const resUser = resUserAccountSchema.parse(user);
  const resData = {
    company: {
      name: companyData?.name,
    },
    user: resUser,
    projectList: companyData?.project,
  };

  return res.status(200).json({ message: "Registered", data: resData });
}
