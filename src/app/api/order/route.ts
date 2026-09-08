import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { orderRequestSchema } from "@/lib/validation/orderSchema";

export async function POST(req: NextRequest) {
  try {
    const body: unknown = await req.json();

    const parsed = orderRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request data", issues: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { form, productConfig, items } = parsed.data;

    const session = await getServerSession(authOptions);

    const normalizedItems = items?.length
      ? items
      : productConfig
        ? [{ quantity: Number(form.quantity) || 1, productConfig }]
        : [];

    if (normalizedItems.length === 0) {
      return NextResponse.json(
        { message: "At least one product config is required" },
        { status: 400 },
      );
    }

    const createdOrder = await prisma.order.create({
      data: {
        firstName: form.firstName,
        lastName: form.lastName,
        county: form.county,
        country: form.country,
        email: form.email,
        phoneCountryCode: form.phoneCountryCode,
        phoneNumber: form.phoneNumber,
        organisation: form.organisation,
        quantity:
          Number(form.quantity) ||
          normalizedItems.reduce((sum, item) => sum + item.quantity, 0),
        message: form.message,
        items: {
          create: normalizedItems.map((item) => ({
            quantity: item.quantity,
            config: JSON.parse(
              JSON.stringify(item.productConfig),
            ) as Prisma.InputJsonValue,
          })),
        },
        userId: session?.user?.id ?? null,
      },
    });

    return NextResponse.json(
      {
        message: "Order submitted successfully.",
        data: createdOrder,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error processing order:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({ data: orders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}