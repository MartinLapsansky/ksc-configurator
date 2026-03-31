"use client"

import {useState} from "react";
import React from "react";
import {signIn} from "next-auth/react";
import {useSearchParams, useRouter} from "next/navigation";


export default function SignInPage() {

    const [email,setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const SearchParams = useSearchParams();
    const callbackUrl = SearchParams.get("callbackUrl") ?? "/";

    const router = useRouter();

    const handleLogin = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setError("");

        try {
            const res = await signIn("credentials",{
                email,
                password,
                redirect: false,
                callbackUrl
            })

            if (!res || res.error) {
                setError("Nesprávny email alebo heslo.");
                return;
            }

        } catch (error) {
            setError("Nesprávny email alebo heslo.");
        }

        const me = await fetch("/api/auth/me", {cache: "no-store"}).then(res => res.json().catch(() => null));

        const role = me?.user?.role as string | undefined;

        if (role === "SUPERADMIN"){
            router.push("/admin/dashboard");
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center w-1/3 mx-auto">
            <div className="bg-white p-8 mt-15 rounded-lg shadow-md w-500">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Prihlásenie
                </h1>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Heslo
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--highlight)]"
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <a href="/auth/forgot-password" className="text-sm text-[var(--highlight)] hover:underline mb-2">
                        Zabudnuté heslo?
                    </a>

                    <button
                        type="submit"
                        className="mt-3 w-full py-2 px-4 bg-[var(--highlight)] text-black font-semibold rounded-md hover:bg-[#b8925f] transition-colors"
                    >
                        Prihlásiť sa
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Nemáš účet? Registrácia je možná iba cez pozvánku.
                </p>
            </div>
        </div>

    );
}