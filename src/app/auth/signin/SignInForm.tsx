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
        <div className="min-h-screen flex items-center justify-center w-1/3 mx-auto">
            <div className="bg-white p-8 mt-15 rounded-lg shadow-md w-500">
                <h1 className="text-3xl font-bold mb-6 text-black text-center">
                    Prihlásenie
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
                            className="mt-1 block w-full px-3 text-black py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Heslo
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <a
                        href="/auth/forgot-password"
                        className="text-sm text-black hover:underline mb-2"
                    >
                        Zabudnuté heslo?
                    </a>

                    <div className="flex items-center justify-center">
                        <button
                            type="submit"
                            className="mt-3 w-30 py-2 px-4 cursor-pointer bg-green-800 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
                        >
                            Prihlásiť sa
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}