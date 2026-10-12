"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/categories/new", label: "New category" },
  { href: "/admin/products/new", label: "New product" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-4">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={
              isActive
                ? "rounded-lg bg-gray-300 px-3 py-2 font-medium text-black"
                : "rounded-lg px-3 py-2 font-medium text-black hover:bg-gray-100"
            }
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}