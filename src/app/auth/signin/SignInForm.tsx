"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl,
            });
            console.log("signIn result:", res);

            if (!res || res.error) {
                setError("Wrong credentials.");
                return;
            }
            if (res?.ok){
                router.push(callbackUrl);
                router.refresh();
            }
        } catch {
            setError("Nesprávny email alebo heslo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md sm:p-8">
                <h1 className="mb-6 text-center text-2xl font-bold text-black sm:text-3xl">
                    Log in
                </h1>

                <form onSubmit={handleLogin} className="space-y-4">
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
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm outline-none transition focus:ring-2 focus:ring-[var(--highlight)]"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black shadow-sm outline-none transition focus:ring-2 focus:ring-[var(--highlight)]"
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <div className="flex justify-start">
                        <a
                            href="/auth/forgot-password"
                            className="text-sm text-black hover:underline"
                        >
                            Forgot password?
                        </a>
                    </div>

                    <div className="pt-2 text-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md bg-green-800 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading && (
                                <span
                                    aria-hidden="true"
                                    className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                                />
                            )}
                            {isLoading ? "Logging in..." : "Log in"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}