"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerWithInvitation } from "@/features/auth/actions/registerWithInvitation";
import PasswordInput from "@/components/ui/PasswordInput";
import validatePassword, {validateEmail} from "@/features/auth/utils/validateCredentials";

type RegisterFormProps = {
  email: string;
  token: string;
};

export default function RegisterForm({ email, token }: RegisterFormProps) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const passwordError = validatePassword(password);
    const validEmail = validateEmail(email);

    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (!validEmail) {
      setError("Invalid email address.");
      setIsLoading(false);
      return;
    }

    try {
      const result = await registerWithInvitation({
        token,
        password,
        confirmPassword,
      });

      if (!result.ok) {
        setError(result.error ?? "Registration failed.");
        return;
      }

      router.push("/auth/signin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md sm:p-8">
        <h1 className="mb-2 text-center text-2xl font-bold text-black sm:text-3xl">
          Create your account
        </h1>
        <p className="mb-6 text-center text-sm text-gray-600">
          Set a password for <span className="font-medium text-black">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              readOnly
              disabled
              className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-gray-500 shadow-sm outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <PasswordInput
              id="password"
              value={password}
              onChangeAction={setPassword}
              required
              className=""
            />
            <p className="mt-1 text-xs text-gray-500">
              At least 8 characters, one uppercase letter, one number and one
              special character.
            </p>
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm password
            </label>
            <PasswordInput
              id="confirmPassword"
              value={confirmPassword}
              onChangeAction={setConfirmPassword}
              required
              className=""
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="pt-2 text-center">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-[#008DD2] px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && (
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                />
              )}
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}