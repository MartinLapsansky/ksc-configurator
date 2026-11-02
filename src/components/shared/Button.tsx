import React from "react";
import Link from "next/link";

type ButtonSize = "sm" | "md" | "lg";
type ButtonVariant = "primary" | "danger" | "brand" | "secondary" | "outline";

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-6 py-2.5 text-sm",
  md: "px-6 py-2.5 text-base",
  lg: "px-6 py-2.5 text-xl",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-black text-white shadow-sm hover:bg-gray-600",
  danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
  brand: "bg-[#008DD2] text-white shadow-sm hover:bg-green-700",
  secondary: "border border-gray-400 bg-gray-700 text-white shadow-sm hover:bg-gray-600",
  outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 cursor-pointer rounded-[35px] font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

type ButtonBaseProps = {
  /** Visual size of the button. Defaults to `md`. */
  size?: ButtonSize;
  /** Color variant of the button. Defaults to `primary`. */
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

type ButtonProps =
  | (ButtonBaseProps &
      React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (ButtonBaseProps &
      React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string });

/**
 * Reusable action button with a unified appearance across the app. Uses a
 * consistent 35px corner radius. Renders a Next.js `Link` when `href` is
 * provided, otherwise a native `button`.
 */
export default function Button({
  size = "md",
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorProps } = props;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}