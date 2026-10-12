import {Prisma} from "@prisma/client";
import {prisma} from "@/lib/prisma";

const crewFront = (file: string) =>
    `/products/crewnecks/base/front/${file}`;
const crewBack = (file: string) => `/products/crewnecks/base/back/${file}`;
const crewLayer = (file: string) => `/products/crewnecks/layers/${file}`;


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

    const leisurewear = await prisma.category.upsert({
        where: { slug: "leisurewear" },
        update: {
            name: "Leisurewear",
            sortOrder: 1,
            active: true,
            coverImageUrl: crewFront("helios_crewneck_navy_royal_white.png"),
        },
        create: {
            name: "Leisurewear",
            slug: "leisurewear",
            sortOrder: 1,
            active: true,
            coverImageUrl: crewFront("helios_crewneck_navy_royal_white.png"),
        },
    });



    const crewNecks = await prisma.category.upsert({
        where: { slug: "crew-necks" },
        update: {
            name: "Crew necks",
            parentId: leisurewear.id,
            sortOrder: 1,
            active: true,
            coverImageUrl: crewFront("helios_crewneck_navy_royal_white.png"),
        },
        create: {
            name: "Crew necks",
            slug: "crew-necks",
            parentId: leisurewear.id,
            sortOrder: 1,
            active: true,
            coverImageUrl: crewFront("helios_crewneck_navy_royal_white.png"),
        },
    });

    // ── Products ─

    await prisma.product.upsert({
        where: { slug: "helios-crew-neck" },
        update: {
            name: "Helios Crew Neck",
            categoryId: crewNecks.id,
            hasBackView: true,
            coverImageUrl: crewFront("helios_crewneck_navy_royal_white.png"),
            definition: crewNeckDefinition as Prisma.InputJsonValue,
        },
        create: {
            slug: "helios-crew-neck",
            name: "Helios Crew Neck",
            categoryId: crewNecks.id,
            hasBackView: true,
            coverImageUrl: crewFront("helios_crewneck_navy_royal_white.png"),
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