import { Request, Response } from "express";
import { prisma } from "../prisma";
import { z } from "zod";
import { ulid } from "ulid";
import bcrypt from "bcryptjs";

import BadRequestError from "../errors/bad-request-error";
import { formatZodValidationErrors } from "../util/zod";

import { registerCompanySchema } from "../services/Company/schema/company.schema";

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
