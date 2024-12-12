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
  reqGetProjectSchema,
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
  const user = req.session.user;
  const cid = user?.cid; // get form express-session
  if (!cid) {
    throw new BadRequestError({ code: 401, message: "Unauthorized Error" });
  }

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

  //! 特殊處理 如果為 null 的資料拉
  createResult.config = createResult.config
    ? JSON.parse(createResult.config)
    : configSchema.parse({});
  createResult.auto = createResult.auto
    ? JSON.parse(createResult.auto)
    : autoSchema.parse({});
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
  const user = req.session.user;
  const cid = user?.cid; // get form express-session
  if (!cid) {
    throw new BadRequestError({ code: 401, message: "Unauthorized Error" });
  }
  const { id } = req.params;

  // 嘗試轉換 id 為數字
  const pid = Number(id);

  if (isNaN(pid)) {
    throw new BadRequestError({ message: "Invalid project ID" });
  }

  const projectData = {
    cid,
    pid,
  };
  console.log("projectData", projectData);

  const project = await prisma.project.findUnique({
    where: projectData,
  });

  if (!project) {
    throw new BadRequestError({
      code: 404,
      message: "查無此專案",
    });
  }

  //! 特殊處理 如果為 null 的資料拉
  project.config = project.config
    ? JSON.parse(project.config)
    : configSchema.parse({});
  project.auto = project.auto ? JSON.parse(project.auto) : autoSchema.parse({});

  const resData = resProjectSchema.parse(project);

  return res.status(200).json({ message: "Project Infomation", date: resData });
}
