import { PrismaClient, Prisma } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  ),
});

// ── Asset URL helpers ──
const jerseyBase = (file: string) => `/products/jerseys/base/${file}`;
const jerseyLayer = (file: string) => `/products/jerseys/layers/${file}`;
const crewFront = (file: string) =>
  `/products/crewnecks/base/front/${file}`;
const crewBack = (file: string) => `/products/crewnecks/base/back/${file}`;
const crewLayer = (file: string) => `/products/crewnecks/layers/${file}`;
const zipBase = (file: string) => `/products/zip-tops/base/${file}`;
const zipLayer = (file: string) => `/products/zip-tops/layers/${file}`;
const logos = (file: string) => `/products/logos/${file}`;

// ── Jersey Design 146 definition ──
const jerseyDefinition = {
  version: 1,
  baseImage: { pickerKey: "bgColor" },
  pickers: [
    {
      key: "bgColor",
      type: "color",
      label: "Main Body Colour",
      options: [
        {
          id: "bg-hot-pink",
          name: "Pink",
          hex: "#e4007f",
          imageUrl: jerseyBase("jersey-hot-pink.png"),
          backImageUrl: jerseyBase("jersey-purple-back.png"),
        },
        {
          id: "bg-purple",
          name: "Purple",
          hex: "#6b2bd6",
          imageUrl: jerseyBase("jersey-purple.png"),
          backImageUrl: jerseyBase("jersey-purple-back.png"),
        },
        {
          id: "bg-lavender",
          name: "Lavender",
          hex: "#8b7bd6",
          imageUrl: jerseyBase("jersey-levender.png"),
          backImageUrl: jerseyBase("jersey-levender-back.png"),
        },
        {
          id: "bg-lime-green",
          name: "Pastel green",
          hex: "#7ee0b0",
          imageUrl: jerseyBase("jersey-lime-green.png"),
          backImageUrl: jerseyBase("jersey-lime-green-back.png"),
        },
      ],
    },
    {
      key: "stripeColor",
      type: "color",
      label: "Stripes Colour",
      options: [
        { id: "stripe-black", name: "Black", hex: "#111111" },
        { id: "stripe-red", name: "Red", hex: "#d4002a" },
        { id: "stripe-gold", name: "Gold", hex: "#F4C531" },
        { id: "stripe-royal", name: "Royal", hex: "#0C4A9F" },
        { id: "stripe-green", name: "Green", hex: "#008937" },
      ],
    },
    {
      key: "brandingColor",
      type: "color",
      label: 'Branding "KCS" Colour',
      options: [
        { id: "branding-white", name: "White", hex: "#ffffff" },
        { id: "branding-black", name: "Black", hex: "#000000" },
        { id: "branding-gold", name: "Gold", hex: "#F4C531" },
        { id: "branding-royal", name: "Royal", hex: "#0C4A9F" },
      ],
    },
    {
      key: "leftChestLogoUrl",
      type: "imageUpload",
      label: "Left Chest Logo",
    },
    {
      key: "rightLogo",
      type: "staticLogo",
      label: "Right Chest Logo",
      options: [
        { name: "Camogie", src: logos("camogie_logo.svg") },
        { name: "Gaa", src: logos("gaa_logo.png") },
        { name: "Lgfa", src: logos("lgfa-logo.png") },
      ],
    },
    {
      key: "sponsorLogoUrl",
      type: "imageUpload",
      label: "Front Sponsor Logo",
    },
    {
      key: "frontTextConfig",
      type: "text",
      label: "Front Sponsor Text",
      view: "front",
      position: { x: 0.49, y: 0.54 },
      colorOptions: [
        { id: "front-text-black", name: "Black", hex: "#000000" },
        { id: "front-text-gold", name: "Gold", hex: "#F4C531" },
        { id: "front-text-white", name: "White", hex: "#FFFFFF" },
      ],
    },
    {
      key: "backLogoUrl",
      type: "imageUpload",
      label: "Back Sponsor Logo",
    },
    {
      key: "leftSleeveLogoUrl",
      type: "imageUpload",
      label: "Left Sleeve Logo",
    },
    {
      key: "rightSleeveLogoUrl",
      type: "imageUpload",
      label: "Right Sleeve Logo",
    },
    {
      key: "backTextConfig",
      type: "text",
      label: "Back Sponsor Text",
      view: "back",
      position: { x: 0.49, y: 0.54 },
      colorOptions: [
        { id: "back-text-black", name: "Black", hex: "#000000" },
        { id: "back-text-gold", name: "Gold", hex: "#F4C531" },
      ],
    },
  ],
  overlays: {
    front: [
      {
        key: "front-stripes",
        layerUrl: jerseyLayer("front-stripes-layer.png"),
        source: { type: "tint", pickerKey: "stripeColor" },
      },
      {
        key: "branding",
        layerUrl: jerseyLayer("kcs-logo-layer.png"),
        source: { type: "tint", pickerKey: "brandingColor" },
      },
      {
        key: "leftChest",
        layerUrl: jerseyLayer("crest-logo-layer.png"),
        source: { type: "upload", pickerKey: "leftChestLogoUrl" },
      },
      {
        key: "rightLogo",
        layerUrl: "",
        source: {
          type: "staticLogo",
          pickerKey: "rightLogo",
          logoMap: {
            Camogie: jerseyLayer("camogie-logo-layer.png"),
            Gaa: jerseyLayer("gaa-logo-layer.png"),
            Lgfa: jerseyLayer("lgfa-logo-layer.png"),
          },
        },
      },
      {
        key: "sponsorLogoFront",
        layerUrl: jerseyLayer("sponsor-logo-layer.png"),
        source: { type: "upload", pickerKey: "sponsorLogoUrl" },
      },
      {
        key: "leftSleeveLogo",
        layerUrl: jerseyLayer("left_sleeve_logo.png"),
        source: { type: "upload", pickerKey: "leftSleeveLogoUrl" },
      },
      {
        key: "rightSleeveLogo",
        layerUrl: jerseyLayer("right_sleeve_logo.png"),
        source: { type: "upload", pickerKey: "rightSleeveLogoUrl" },
      },
    ],
    back: [
      {
        key: "back-stripes",
        layerUrl: jerseyLayer("back-stripes-layer.png"),
        source: { type: "tint", pickerKey: "stripeColor" },
      },
      {
        key: "backSponsorLogo",
        layerUrl: jerseyLayer("back-sponsor-logo-layer.png"),
        source: { type: "upload", pickerKey: "backLogoUrl" },
      },
    ],
  },
};

// ── Soul Half Zip definition ──
const halfZipDefinition = {
  version: 1,
  baseImage: { pickerKey: "bgColor" },
  pickers: [
    {
      key: "bgColor",
      type: "doubleColor",
      label: "Main Body Colour",
      options: [
        {
          id: "zip-black-graphite",
          name: "Black / Graphite",
          hex1: "#1a1a1a",
          hex2: "#4a4a4a",
          imageUrl: zipBase("zip_black_graphite.png"),
        },
        {
          id: "zip-black-green",
          name: "Black / Green",
          hex1: "#1a1a1a",
          hex2: "#008937",
          imageUrl: zipBase("zip_black_green.png"),
        },
        {
          id: "zip-black-red",
          name: "Black / Red",
          hex1: "#1a1a1a",
          hex2: "#d4002a",
          imageUrl: zipBase("zip_black_red.png"),
        },
        {
          id: "zip-navy-green",
          name: "Navy / Green",
          hex1: "#0C4A9F",
          hex2: "#008937",
          imageUrl: zipBase("zip_navy_green.png"),
        },
        {
          id: "zip-navy-maroon",
          name: "Navy / Maroon",
          hex1: "#0C4A9F",
          hex2: "#800020",
          imageUrl: zipBase("zip_navy_maroon.png"),
        },
        {
          id: "zip-navy-royal",
          name: "Navy / Royal",
          hex1: "#0C4A9F",
          hex2: "#4169E1",
          imageUrl: zipBase("zip_navy_royal.png"),
        },
        {
          id: "zip-navy-sky",
          name: "Navy / Sky",
          hex1: "#0C4A9F",
          hex2: "#87CEEB",
          imageUrl: zipBase("zip_navy_sky.png"),
        },
      ],
    },
    { key: "leftChestLogoUrl", type: "imageUpload", label: "Left Chest Logo" },
    {
      key: "rightChestLogoUrl",
      type: "imageUpload",
      label: "Right Chest Logo",
    },
  ],
  overlays: {
    front: [
      {
        key: "leftChest",
        layerUrl: zipLayer("left_chest_logo_layer.png"),
        source: { type: "upload", pickerKey: "leftChestLogoUrl" },
      },
      {
        key: "rightChest",
        layerUrl: zipLayer("right_chest_logo_layer.png"),
        source: { type: "upload", pickerKey: "rightChestLogoUrl" },
      },
    ],
  },
};

// ── Helios Crew Neck definition ──
const crewNeckBgOptions = [
  {
    id: "crewneck-black-graphite-gold",
    name: "Black / Graphite / Gold",
    hex1: "#1a1a1a",
    hex2: "#4a4a4a",
    hex3: "#F4C531",
    file: "helios_crewneck_black_graphite_gold",
  },
  {
    id: "crewneck-black-graphite-red",
    name: "Black / Graphite / Red",
    hex1: "#1a1a1a",
    hex2: "#4a4a4a",
    hex3: "#d4002a",
    file: "helios_crewneck_black_graphite_red",
  },
  {
    id: "crewneck-black-graphite-white",
    name: "Black / Graphite / White",
    hex1: "#1a1a1a",
    hex2: "#4a4a4a",
    hex3: "#ffffff",
    file: "helios_crewneck_black_graphite_white",
  },
  {
    id: "crewneck-black-green-red",
    name: "Black / Green / Red",
    hex1: "#1a1a1a",
    hex2: "#008937",
    hex3: "#d4002a",
    file: "helios_crewneck_black_green_red",
  },
  {
    id: "crewneck-black-green-white",
    name: "Black / Green / White",
    hex1: "#1a1a1a",
    hex2: "#008937",
    hex3: "#ffffff",
    file: "helios_crewneck_black_green_white",
  },
  {
    id: "crewneck-black-maroon-white",
    name: "Black / Maroon / White",
    hex1: "#1a1a1a",
    hex2: "#800020",
    hex3: "#ffffff",
    file: "helios_crewneck_black_maroon_white",
  },
  {
    id: "crewneck-navy-green-gold",
    name: "Navy / Green / Gold",
    hex1: "#0C4A9F",
    hex2: "#008937",
    hex3: "#F4C531",
    file: "helios_crewneck_navy_green_gold",
  },
  {
    id: "crewneck-navy-green-white",
    name: "Navy / Green / White",
    hex1: "#0C4A9F",
    hex2: "#008937",
    hex3: "#ffffff",
    file: "helios_crewneck_navy_green_white",
  },
  {
    id: "crewneck-navy-purple-gold",
    name: "Navy / Purple / Gold",
    hex1: "#0C4A9F",
    hex2: "#6b2bd6",
    hex3: "#F4C531",
    file: "helios_crewneck_navy_purple_gold",
  },
  {
    id: "crewneck-navy-red",
    name: "Navy / Red",
    hex1: "#0C4A9F",
    hex2: "#d4002a",
    hex3: "#d4002a",
    file: "helios_crewneck_navy_red",
  },
  {
    id: "crewneck-navy-royal-gold",
    name: "Navy / Royal / Gold",
    hex1: "#0C4A9F",
    hex2: "#4169E1",
    hex3: "#F4C531",
    file: "helios_crewneck_navy_royal_gold",
  },
  {
    id: "crewneck-navy-royal-white",
    name: "Navy / Royal / White",
    hex1: "#0C4A9F",
    hex2: "#4169E1",
    hex3: "#ffffff",
    file: "helios_crewneck_navy_royal_white",
  },
  {
    id: "crewneck-navy-sky",
    name: "Navy / Sky",
    hex1: "#0C4A9F",
    hex2: "#87CEEB",
    hex3: "#87CEEB",
    file: "helios_crewneck_navy_sky",
  },
];

const crewNeckDefinition = {
  version: 1,
  baseImage: { pickerKey: "bgColor" },
  pickers: [
    {
      key: "bgColor",
      type: "tripleColor",
      label: "Main Body Colour",
      options: crewNeckBgOptions.map(({ file, ...option }) => ({
        ...option,
        imageUrl: crewFront(`${file}.png`),
        backImageUrl: crewBack(`${file}_back.png`),
      })),
    },
    { key: "leftChestLogoUrl", type: "imageUpload", label: "Left Chest Logo" },
    {
      key: "rightChestLogoUrl",
      type: "imageUpload",
      label: "Right Chest Logo",
    },
    { key: "backLogoUrl", type: "imageUpload", label: "Back Logo" },
  ],
  overlays: {
    front: [
      {
        key: "leftChest",
        layerUrl: crewLayer("left_logo_layer.png"),
        source: { type: "upload", pickerKey: "leftChestLogoUrl" },
      },
      {
        key: "rightChest",
        layerUrl: crewLayer("right_logo_layer.png"),
        source: { type: "upload", pickerKey: "rightChestLogoUrl" },
      },
    ],
    back: [
      {
        key: "backLogo",
        layerUrl: crewLayer("back_logo_layer.png"),
        source: { type: "upload", pickerKey: "backLogoUrl" },
      },
    ],
  },
};

async function main() {
  const hashedPassword = await hash("adminpassword123", 10);

  await prisma.user.upsert({
    where: { email: "mbaca130@gmail.com" },
    update: { name: "Admin", password: hashedPassword, role: "admin" },
    create: {
      email: "mbaca130@gmail.com",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  });

  // ── Categories ──
  const sportswear = await prisma.category.upsert({
    where: { slug: "sportswear" },
    update: { name: "Sports Kit", sortOrder: 0, active: true },
    create: { name: "Sports Kit", slug: "sportswear", sortOrder: 0, active: true },
  });

  const leisurewear = await prisma.category.upsert({
    where: { slug: "leisurewear" },
    update: { name: "Leisurewear", sortOrder: 1, active: true },
    create: { name: "Leisurewear", slug: "leisurewear", sortOrder: 1, active: true },
  });

  const jerseys = await prisma.category.upsert({
    where: { slug: "jerseys" },
    update: { name: "Jerseys", parentId: sportswear.id, sortOrder: 0, active: true },
    create: { name: "Jerseys", slug: "jerseys", parentId: sportswear.id, sortOrder: 0, active: true },
  });

  const zipTops = await prisma.category.upsert({
    where: { slug: "zip-tops" },
    update: { name: "Zip Tops", parentId: leisurewear.id, sortOrder: 0, active: true },
    create: { name: "Zip Tops", slug: "zip-tops", parentId: leisurewear.id, sortOrder: 0, active: true },
  });

  const crewNecks = await prisma.category.upsert({
    where: { slug: "crew-necks" },
    update: { name: "Crew necks", parentId: leisurewear.id, sortOrder: 1, active: true },
    create: { name: "Crew necks", slug: "crew-necks", parentId: leisurewear.id, sortOrder: 1, active: true },
  });

  // ── Products ──
  await prisma.product.upsert({
    where: { slug: "jersey-design-146" },
    update: {
      name: "Jersey Design 146",
      categoryId: jerseys.id,
      hasBackView: true,
      definition: jerseyDefinition as Prisma.InputJsonValue,
    },
    create: {
      slug: "jersey-design-146",
      name: "Jersey Design 146",
      categoryId: jerseys.id,
      hasBackView: true,
      definition: jerseyDefinition as Prisma.InputJsonValue,
    },
  });

  await prisma.product.upsert({
    where: { slug: "soul-half-zip" },
    update: {
      name: "Soul Half Zip",
      categoryId: zipTops.id,
      hasBackView: false,
      definition: halfZipDefinition as Prisma.InputJsonValue,
    },
    create: {
      slug: "soul-half-zip",
      name: "Soul Half Zip",
      categoryId: zipTops.id,
      hasBackView: false,
      definition: halfZipDefinition as Prisma.InputJsonValue,
    },
  });

  await prisma.product.upsert({
    where: { slug: "helios-crew-neck" },
    update: {
      name: "Helios Crew Neck",
      categoryId: crewNecks.id,
      hasBackView: true,
      definition: crewNeckDefinition as Prisma.InputJsonValue,
    },
    create: {
      slug: "helios-crew-neck",
      name: "Helios Crew Neck",
      categoryId: crewNecks.id,
      hasBackView: true,
      definition: crewNeckDefinition as Prisma.InputJsonValue,
    },
  });

  console.log("Seeded auth user, categories and products.");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });