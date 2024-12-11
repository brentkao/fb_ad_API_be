import { company_status, Company } from "@prisma/client";
import { z } from "zod";

export const companySchema = z.object({
  cid: z.number().min(1000000, "Cid must be bigger than 1000000"),
  name: z.string().min(5, "Name must be at least 5 characters long"),
  status: z.nativeEnum(company_status),
  create_at: z.date(),
  update_at: z.date(),
});

export const registerCompanySchema = companySchema.pick({
  name: true,
});

export type RegisterCompanySchema = z.infer<
  typeof registerCompanySchema
>;