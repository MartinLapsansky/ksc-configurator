import { z } from "zod";

/**
 * Data-driven product definition. A single `ProductDefinition` describes the
 * pickers a product exposes and how overlay layers are built from the selected
 * values. This replaces the hardcoded per-product catalog and `buildOverlays.ts`.
 */

const colorOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  hex: z.string(),
  imageUrl: z.string().optional(),
  backImageUrl: z.string().optional(),
});

const doubleColorOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  hex1: z.string(),
  hex2: z.string(),
  imageUrl: z.string().optional(),
  backImageUrl: z.string().optional(),
});

const tripleColorOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  hex1: z.string(),
  hex2: z.string(),
  hex3: z.string(),
  imageUrl: z.string().optional(),
  backImageUrl: z.string().optional(),
});

/**
 * A melange option represents a swatch that is not necessarily a single flat
 * colour. It may carry a `pattern` image (a texture/fabric swatch), a single
 * `hex`, and/or the same `hex1`/`hex2`/`hex3` values as the multi-tone pickers.
 * This lets a single `melange` picker mix solid, double, triple and pattern
 * (melange) options within one picker.
 *
 * The swatch renderer picks the first available representation in this order:
 * `pattern` -> `hex1/hex2/hex3` (triple) -> `hex1/hex2` (double) -> `hex`.
 */
const melangeColorOptionSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    hex: z.string().optional(),
    hex1: z.string().optional(),
    hex2: z.string().optional(),
    hex3: z.string().optional(),
    /** Public path (e.g. `/products/melange/...`) to the melange swatch image. */
    pattern: z.string().optional(),
    imageUrl: z.string().optional(),
    backImageUrl: z.string().optional(),
  })
  .refine(
    (option) =>
      option.pattern !== undefined ||
      option.hex !== undefined ||
      option.hex1 !== undefined,
    {
      message:
        "A melange option must define a pattern or at least one hex value",
    },
  );

const staticLogoOptionSchema = z.object({
  name: z.string(),
  src: z.string(),
});

const textColorOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  hex: z.string(),
});

const colorPickerDefSchema = z.object({
  key: z.string(),
  type: z.literal("color"),
  label: z.string(),
  options: z.array(colorOptionSchema),
});

const doubleColorPickerDefSchema = z.object({
  key: z.string(),
  type: z.literal("doubleColor"),
  label: z.string(),
  options: z.array(doubleColorOptionSchema),
});

const tripleColorPickerDefSchema = z.object({
  key: z.string(),
  type: z.literal("tripleColor"),
  label: z.string(),
  options: z.array(tripleColorOptionSchema),
});

const melangeColorPickerDefSchema = z.object({
  key: z.string(),
  type: z.literal("melange"),
  label: z.string(),
  options: z.array(melangeColorOptionSchema),
});

const imageUploadPickerDefSchema = z.object({
  key: z.string(),
  type: z.literal("imageUpload"),
  label: z.string(),
});

const staticLogoPickerDefSchema = z.object({
  key: z.string(),
  type: z.literal("staticLogo"),
  label: z.string(),
  options: z.array(staticLogoOptionSchema),
});

const textPickerDefSchema = z.object({
  key: z.string(),
  type: z.literal("text"),
  label: z.string(),
  colorOptions: z.array(textColorOptionSchema),
  /** Percentage position (0..1) within the drawn product image. */
  position: z
    .object({
      x: z.number(),
      y: z.number(),
    })
    .optional(),
  /** Which view the text is rendered on. Defaults to "front". */
  view: z.enum(["front", "back"]).optional(),
});

export const pickerDefSchema = z.discriminatedUnion("type", [
  colorPickerDefSchema,
  doubleColorPickerDefSchema,
  tripleColorPickerDefSchema,
  melangeColorPickerDefSchema,
  imageUploadPickerDefSchema,
  staticLogoPickerDefSchema,
  textPickerDefSchema,
]);

export const overlayLayerDefSchema = z.object({
  key: z.string(),
  layerUrl: z.string(),
  source: z.discriminatedUnion("type", [
    z.object({
      type: z.literal("tint"),
      pickerKey: z.string(),
    }),
    z.object({
      type: z.literal("upload"),
      pickerKey: z.string(),
    }),
    z.object({
      type: z.literal("staticLogo"),
      pickerKey: z.string(),
      logoMap: z.record(z.string(), z.string()),
    }),
  ]),
});

export const productDefinitionSchema = z.object({
  version: z.literal(1),
  /** Picker whose selected option carries the front/back base image. */
  baseImage: z
    .object({
      pickerKey: z.string(),
    })
    .optional(),
  pickers: z.array(pickerDefSchema),
  overlays: z.object({
    front: z.array(overlayLayerDefSchema),
    back: z.array(overlayLayerDefSchema).optional(),
  }),
});

export type PickerDef = z.infer<typeof pickerDefSchema>;
export type OverlayLayerDef = z.infer<typeof overlayLayerDefSchema>;
export type ProductDefinition = z.infer<typeof productDefinitionSchema>;