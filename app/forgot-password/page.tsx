'use client';
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import Banner from "@/components/PlainBanner";


const Forgot_Password = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    async function handlePasswordReset(e: React.FormEvent){
        e.preventDefault()
        try {
            await axios.post("/api/auth/email", {
                email,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Email sent successfully!");
            router.push("/login");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError("Failed to send email: " + (error.response?.data?.error || error.message));
            } else {
                setError("An unexpected error occurred.");
            }
        }
    }

    return (
        //absolute inset-0 bg-black opacity-50
        <div>
            <Banner></Banner>
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-[url('/freedomtrail_medallion.jpg')] " >
            <div className="bg-white p-5 rounded-3xl w-96 ">
                <h2 className="text-4xl rounded-md bg-blue-900 p-2 font-bold text-center text-white mb-6 font-cinzel_decorative">Request Password Reset Link</h2>

                <form onSubmit={handlePasswordReset} className="flex flex-col">
                    <label className="text-blue-900 font-garamond text-2xl font-extrabold mb-2">Email:</label>
                    <input
                        type="email"
                        placeholder=""
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-full bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-4"
                        required
                    />

                    {error && <p className="text-red-500 mb-2">{error}</p>}

                    {/* Reset Password Button */}
                    <button type="submit"
                            className="bg-blue-900 text-white p-3 rounded-full text-2xl font-semibold font-garamond hover:bg-blue-800 transition">
                        Get Reset Link
                    </button>
                </form>
            </div>
        </div>
        </div>
    );
};

export default Forgot_Password;