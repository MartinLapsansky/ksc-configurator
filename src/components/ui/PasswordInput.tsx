"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

type PasswordInputProps = {
  id: string;
  value: string;
  onChangeAction: (value: string) => void;
  required?: boolean;
  className?: string;
};

export default function PasswordInput({
  id,
  value,
  onChangeAction,
  required,
  className,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        id={id}
        value={value}
        onChange={(event) => onChangeAction(event.target.value)}
        required={required}
        className={`mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-black shadow-sm outline-none transition focus:ring-2 focus:ring-(--highlight) ${className ?? ""}`}
      />
      <button
        type="button"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 text-gray-500 transition-colors hover:text-black"
      >
        <FontAwesomeIcon icon={visible ? faEye : faEyeSlash } />
      </button>
    </div>
  );
}