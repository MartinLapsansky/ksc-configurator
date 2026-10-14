"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTIES, type County } from "@/features/orders/constants";

export type ManagerUser = {
  id: string;
  email: string;
  name: string | null;
  role: "user" | "admin";
  counties: string[];
};

type ManagerCountyManagerProps = {
  users: ManagerUser[];
};

export default function ManagerCountyManager({
  users,
}: ManagerCountyManagerProps) {
  const router = useRouter();

  // Local per-user selection state, initialized from the server-provided data.
  const [assignments, setAssignments] = useState<Record<string, County[]>>(
    () =>
      Object.fromEntries(
        users.map((user) => [user.id, (user.counties as County[]) ?? []]),
      ),
  );
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleCounty = (userId: string, county: County) => {
    setAssignments((prev) => {
      const current = prev[userId] ?? [];
      const next = current.includes(county)
        ? current.filter((c) => c !== county)
        : [...current, county];
      return { ...prev, [userId]: next };
    });
  };

  const isDirty = (user: ManagerUser) => {
    const next = assignments[user.id] ?? [];
    const current = user.counties as County[];
    if (next.length !== current.length) return true;
    return next.some((county) => !current.includes(county));
  };

  const save = async (user: ManagerUser) => {
    setSavingId(user.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ counties: assignments[user.id] ?? [] }),
      });

      if (!res.ok) {
        setError(`Failed to save ${user.email ?? user.id}`);
        return;
      }

      router.refresh();
    } catch {
      setError(`Failed to save ${user.email ?? user.id}`);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-black"></h1>
        <p className="mt-1 text-sm text-gray-600">
          Assign counties to each user. A user only sees orders from their
          assigned counties.
        </p>
      </div>

      {error && (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {users.map((user) => (
          <section
            key={user.id}
            className="rounded-lg border border-gray-200 bg-white p-4"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-black">
                  {user.name ?? user.email}
                </p>
                <p className="text-sm text-gray-500">
                  {user.email} · {user.role}
                </p>
              </div>
              <button
                type="button"
                onClick={() => save(user)}
                disabled={savingId === user.id || !isDirty(user)}
                className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {savingId === user.id ? "Saving…" : "Save"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {COUNTIES.map((county) => {
                const checked = (assignments[user.id] ?? []).includes(
                  county as County,
                );
                return (
                  <label
                    key={county}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCounty(user.id, county as County)}
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                    />
                    {county}
                  </label>
                );
              })}
            </div>

            {user.role === "admin" && (
              <p className="mt-3 text-xs text-gray-400">
                Admins see all orders regardless of county assignment.
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}