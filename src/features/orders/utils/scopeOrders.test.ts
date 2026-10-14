import { resolveCountyFilter } from "@/features/orders/utils/scopeOrders";

describe("resolveCountyFilter", () => {
  it("returns no filter for admins", () => {
    expect(resolveCountyFilter("admin", [])).toBeUndefined();
    expect(resolveCountyFilter("admin", ["Cork", "Dublin"])).toBeUndefined();
  });

  it("filters managers to their assigned counties", () => {
    expect(resolveCountyFilter("user", ["Cork", "Dublin"])).toEqual({
      county: { in: ["Cork", "Dublin"] },
    });
  });

  it("returns an empty in-filter for managers with no assignments", () => {
    expect(resolveCountyFilter("user", [])).toEqual({
      county: { in: [] },
    });
  });
});