"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl,
            });

            if (!res || res.error) {
                setError("Nesprávny email alebo heslo.");
                return;
            }

            router.push(callbackUrl);
        } catch {
            setError("Nesprávny email alebo heslo.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-md sm:p-8">
                <h1 className="mb-6 text-center text-2xl font-bold text-black sm:text-3xl">
                    Log in to your account
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

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full rounded-md bg-green-800 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-700"
                        >
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}