import { z } from "zod";
import { productDefinitionSchema } from "@/features/configurator/schemas/productDefinitionSchema";

/**
 * Runtime validation for order/enquiry input received from the client.
 *
 * These schemas are the single source of truth for the request shape; the
 * route derives its types via `z.infer` instead of maintaining parallel
 * TypeScript interfaces.
 */

const baseColorOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  hex: z.string().optional(),
  hex1: z.string().optional(),
  hex2: z.string().optional(),
  hex3: z.string().optional(),
  file: z.unknown().optional(),
  backFile: z.unknown().optional(),
});

const colorOptionSchema = baseColorOptionSchema.extend({
  hex: z.string(),
});

const staticLogoOptionSchema = z.object({
  name: z.string(),
  src: z.string(),
});

const textConfigSchema = z.object({
  enabled: z.boolean(),
  text: z.string(),
  color: z.object({ name: z.string(), hex: z.string() }),
});

const LEGACY_PRODUCT_TYPES = z.enum(["jersey", "halfZip", "crewNeck"]);

const productConfigSchema = z
  .object({
    productId: z.string().optional(),
    productType: z.string().min(1),
    productName: z.string(),
    values: z.record(z.string(), z.unknown()).optional(),
    definitionSnapshot: productDefinitionSchema.optional(),
    bgColor: baseColorOptionSchema.optional(),
    stripeColor: colorOptionSchema.optional(),
    brandingColor: colorOptionSchema.optional(),
    leftChestLogoUrl: z.string().optional(),
    sponsorLogoUrl: z.string().optional(),
    rightLogo: staticLogoOptionSchema.optional(),
    rightChestLogoUrl: z.string().optional(),
    leftSleeveLogoUrl: z.string().optional(),
    rightSleeveLogoUrl: z.string().optional(),
    backLogoUrl: z.string().optional(),
    backTextConfig: textConfigSchema.optional(),
    frontTextConfig: textConfigSchema.optional(),
  })
  .superRefine((config, ctx) => {
    // Legacy products (no definition snapshot) must use a known product type.
    if (!config.definitionSnapshot) {
      const parsed = LEGACY_PRODUCT_TYPES.safeParse(config.productType);
      if (!parsed.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["productType"],
          message: "Unknown product type for legacy configuration",
        });
      }
    }
  });

const enquiryFormSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  county: z.string().trim().min(1),
  country: z.string().optional().default(""),
  email: z.string().trim().toLowerCase().email(),
  phoneCountryCode: z.string().trim().min(1),
  phoneNumber: z.string().trim().min(1),
  organisation: z.string().optional().default(""),
  quantity: z.string().trim().min(1),
  message: z.string().optional().default(""),
});

const orderItemInputSchema = z.object({
  quantity: z.number().int().positive(),
  productConfig: productConfigSchema,
});

export const orderRequestSchema = z.object({
  form: enquiryFormSchema,
  productConfig: productConfigSchema.optional(),
  items: z.array(orderItemInputSchema).optional(),
});

export type EnquiryFormInput = z.infer<typeof enquiryFormSchema>;
export type OrderRequestInput = z.infer<typeof orderRequestSchema>;