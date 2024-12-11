import { Request, Response } from "express";
import { prisma } from "../prisma";
import { date, z } from "zod";
import { ulid } from "ulid";
import bcrypt from "bcryptjs";

import BadRequestError from "../errors/bad-request-error";
import { formatZodValidationErrors } from "../util/zod";

import {
  configSchema,
  autoSchema,
  registerProjectSchema,
  resProjectSchema,
} from "../services/Project/schema/project.schema";

/**
 * @swagger
 * /api/company/project:
 *   post:
 *     tags:
 *       - project
 *     summary: Register a project
 *     description: Create a new project for a company.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the project.
 *                 example: "ParaZeni Studio"
 *     responses:
 *       200:
 *         description: Successfully registered the project.
 *       400:
 *         description: Invalid request data.
 */
export async function register(req: Request, res: Response) {
  const cid = 1000001; // get form express-session

  const result = registerProjectSchema.safeParse(req.body);
  if (!result.success)
    throw new BadRequestError({
      context: formatZodValidationErrors(result.error),
    });

  const { name } = result.data;

  const autoMold = autoSchema.parse({});
  const configMold = configSchema.parse({});

  const config = JSON.stringify(configMold);
  const auto = JSON.stringify(autoMold);

  const projectData = {
    cid,
    name,
    config,
    auto,
  };

  const createResult = await prisma.project.create({
    data: projectData,
  });

  console.log("Create Project Result", createResult);
  const resConfig = JSON.parse(createResult.config || "{}" );
  const resAuto = JSON.parse(createResult.auto || "{}" );
  createResult.config = resConfig;
  createResult.auto = resAuto;
  const resData = resProjectSchema.parse(createResult);

  return res.status(200).json({ message: "Project Registered", data: resData });
}

/**
 * @swagger
 * /api/company/project/{id}:
 *   get:
 *     tags:
 *       - project
 *     summary: Get project details
 *     description: Retrieve the details of a specific project by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the project to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved project details.
 *       400:
 *         description: Invalid request data.
 *       404:
 *         description: Project not found.
 */
export async function getProject(req: Request, res: Response) {
  const cid = 1000001; // get form express-session
  const { id } = req.params;

  // 嘗試轉換 id 為數字
  const pid = Number(id);

  if (isNaN(pid)) {
    throw new Error("Invalid project ID");
  }

  const projectData = {
    cid,
    pid,
  };

  const project = await prisma.project.findUnique({
    where: projectData,
  });

  if (!project) {
    throw new BadRequestError({
      message: "查無此專案",
    });
  }
  const resConfig = JSON.parse(project.config || "{}" );
  const resAuto = JSON.parse(project.auto || "{}" );
  project.config = resConfig;
  project.auto = resAuto;
  const resData = resProjectSchema.parse(project);

  //! 清除 cookie
  return res.status(200).json({ message: "project", date: resData });
}
