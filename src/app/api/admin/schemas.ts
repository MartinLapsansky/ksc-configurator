import { z } from "zod";
import { productDefinitionSchema } from "@/features/configurator/schemas/productDefinitionSchema";

export const categoryInputSchema = z.object({
  name: z.string().trim().min(1),
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});

export const productInputSchema = z.object({
  name: z.string().trim().min(1),
  slug: z
    .string()
    .trim()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  categoryId: z.string().min(1),
  active: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
  hasBackView: z.boolean().default(false),
  frontImageUrl: z.string().nullable().optional(),
  backImageUrl: z.string().nullable().optional(),
  definition: productDefinitionSchema,
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;