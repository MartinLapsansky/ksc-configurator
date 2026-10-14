import { buildOrdersWhere } from "@/features/orders/utils/buildOrdersWhere";

describe("buildOrdersWhere", () => {
  it("applies no filters for admins with no optional filters", () => {
    expect(buildOrdersWhere({ role: "admin", counties: [] })).toEqual({});
  });

  it("applies county filtering for managers", () => {
    expect(
      buildOrdersWhere({ role: "user", counties: ["Cork", "Dublin"] }),
    ).toEqual({ county: { in: ["Cork", "Dublin"] } });
  });

  it("adds an inclusive from date filter", () => {
    const result = buildOrdersWhere({
      role: "admin",
      counties: [],
      from: "2026-01-05",
    });

    expect(result.createdAt).toBeDefined();
    expect((result.createdAt as { gte: Date }).gte.toISOString()).toBe(
      new Date("2026-01-05").toISOString(),
    );
  });

  it("ignores an invalid from date", () => {
    expect(
      buildOrdersWhere({
        role: "admin",
        counties: [],
        from: "not-a-date",
      }),
    ).toEqual({});
  });

  it("adds a status filter for valid statuses", () => {
    expect(
      buildOrdersWhere({ role: "admin", counties: [], status: "cancelled" }),
    ).toEqual({ status: "cancelled" });
  });

  it("ignores invalid status values", () => {
    expect(
      buildOrdersWhere({ role: "admin", counties: [], status: "archived" }),
    ).toEqual({});
  });

  it("combines county, date and status filters", () => {
    const result = buildOrdersWhere({
      role: "user",
      counties: ["Cork"],
      from: "2026-01-05",
      status: "sent",
    });

    expect(result).toMatchObject({
      county: { in: ["Cork"] },
      status: "sent",
    });
    expect(result.createdAt).toBeDefined();
  });
});