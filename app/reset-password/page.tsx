"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, Suspense } from "react";
import axios from "axios";
import Banner from "@/components/PlainBanner";
const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    async function handleResetPassword(e: React.FormEvent) {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await axios.post("/api/auth/reset",
                { email, newPassword },
                { headers: { "Content-Type": "application/json" } }
            );
            router.push("/login");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.error || "Password reset failed.");
            } else {
                setError("Network error occurred.");
            }
        }
    }

    return (
        <div>
            <Banner></Banner>
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-[url('/freedomtrail_medallion.jpg')]">
            <div className="bg-white p-5 rounded-3xl max-w-full lg:w-2/5 sm:w-4/5 sm:h-4/5 justify-center items-center">
                <h2 className="bg-blue-900 p-2 rounded-md text-6xl font-bold text-center text-white mb-6 font-cinzel_decorative">
                    Reset Password
                </h2>

                <form onSubmit={handleResetPassword} className="flex flex-col">
                    <p className="text-blue-900 font-semibold text-center mb-4">
                        Reset password for <strong>{email}</strong>
                    </p>

                    <label className="text-blue-900 font-garamond text-2xl font-extrabold mb-2">
                        New Password:
                    </label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-3 rounded-full bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-4"
                        required
                    />

                    <label className="text-blue-900 font-garamond text-2xl font-extrabold mb-2">
                        Confirm Password:
                    </label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-3 rounded-full bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-6"
                        required
                    />
                    {error && <p className="text-red-500 mb-2">{error}</p>}

                    <button type="submit"
                            className="bg-blue-900 text-white p-3 rounded-full text-2xl font-semibold font-garamond hover:bg-blue-800 transition">
                        Reset your Password
                    </button>
                </form>
            </div>
        </div>
    </div>
    );
};

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ResetPassword />
        </Suspense>
    );
}
