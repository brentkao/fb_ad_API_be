import {} from "@prisma/client";
import { z } from "zod";

import {
  DEFAULT_AUTO_TEMPLATE,
  DEFAULT_AUTO_PARAMETER,
  DEFAULT_CONFIG_SELECTIBLE_COLUMN,
  DEFAULT_CONFIG_USUAL_COLUMN,
} from "../../../constants/project";

// 定義 autoSchema 的基礎結構
export const autoSchema = z
  .object({
    usingTarget: z
      .enum(["weekly", "monthly"])
      .default(DEFAULT_AUTO_PARAMETER.USING_TARGET), // 預設使用 weekly
    weekly: z
      .object({
        selectedDay: z.number().min(0).max(6).default(0), // 預設為周日
      })
      .default({ selectedDay: DEFAULT_AUTO_PARAMETER.WEEKLY_SELECTED_DAY }), // 預設 weekly 格式
    monthly: z
      .object({
        schedules: z
          .array(
            z.object({
              day: z.number().min(1).max(28).default(1), // 預設為 1 號
              hr: z.number().min(0).max(23).default(0), // 預設為 0 時
              min: z.number().min(0).max(59).default(0), // 預設為 0 分
            })
          )
          .default([]), // 預設空陣列
      })
      .default({ schedules: [] }), // 預設 monthly 格式
    isFilter: z.boolean().default(false), // 預設為 false
    impressionThreshold: z
      .number()
      .min(0)
      .default(DEFAULT_AUTO_PARAMETER.IMPRESSION_THRESHOLD), // 預設為 0
    reportEmailList: z.array(z.string().email()).default([]), // 預設為空陣列
  })
  .default(DEFAULT_AUTO_TEMPLATE);

// 定義 config 的 schema
export const configSchema = z.object({
  selectibleColumn: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
        isUsing: z.boolean(),
      })
    )
    .default(DEFAULT_CONFIG_SELECTIBLE_COLUMN), // 使用常數作為預設值
  usualColumn: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
        isUsing: z.boolean(),
      })
    )
    .default(DEFAULT_CONFIG_USUAL_COLUMN), // 使用常數作為預設值
  customizeColumn: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
        isUsing: z.boolean(),
      })
    )
    .default([]), // 預設為空陣列
});

export const projectSchema = z.object({
  pid: z.number().min(5000000, "Pid must be bigger than 5000000"),
  cid: z.number().min(1000000, "Cid must be bigger than 1000000"),
  name: z.string(),
  access_token: z.string(),
  ad_account_id: z.string(),
  config: configSchema,
  auto: autoSchema,
  create_at: z.date(),
  update_at: z.date(),
});

// 基於 autoSchema 的部分更新 Schema
export const registerProjectSchema = projectSchema.pick({
  name: true,
});

export type RegisterProjectSchemaProjectSchema = z.infer<
  typeof registerProjectSchema
>;

// 基於 autoSchema 的部分更新 Schema
export const updateProjectSchema = projectSchema.pick({
  pid: true,
  name: true,
  auto: true,
  config: true,
});

export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;


export const resProjectSchema = projectSchema.pick({
  pid: true,
  name: true,
  ad_account_id: true,
  config: true,
  auto: true,
  create_at: true,
  update_at: true,
});

export type ResProjectSchema = z.infer<typeof resProjectSchema>;
