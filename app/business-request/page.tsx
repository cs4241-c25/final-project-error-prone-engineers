'use client';
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";
import Banner from "@/components/PlainBanner";
import { useSession} from "next-auth/react";

const RequestBusinessOwner = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const { data: session } = useSession();

    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            await axios.post("/api/business_account/request_account", {
                email: session?.user?.email,
                name: name,
                description: description,
            }, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Request submitted successfully!");
            if (session?.user) {
                session.user.role = "pending";
            }
            router.push("/");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError("Failed to submit request: " + (error.response?.data?.error || error.message));
            } else {
                setError("An unexpected error occurred.");
            }
        }
    }

    return (
        <div>
            <Banner />
            <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-[url('/freedomtrail_medallion.jpg')]">
                <div className="bg-white p-6 rounded-3xl w-full max-w-xl shadow-lg">
                    <h2 className="text-4xl bg-blue-900 p-3 text-white font-bold text-center rounded-xl font-cinzel_decorative mb-6">
                        Request Business Owner Account
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <label className="text-blue-900 font-garamond text-xl font-bold">Your Full Name:</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="p-3 rounded-lg bg-[#2F1000] bg-opacity-50 text-white focus:outline-none"
                            required
                        />

                        <label className="text-blue-900 font-garamond text-xl font-bold">Why are you requesting to be a business owner?</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="p-3 h-28 rounded-lg bg-[#2F1000] bg-opacity-50 text-white resize-none focus:outline-none"
                            placeholder="Describe your role or connection to the business..."
                            required
                        />

                        {error && <p className="text-red-500 font-semibold font-garamond">{error}</p>}

                        <button
                            type="submit"
                            className="bg-blue-900 text-white py-3 rounded-full text-xl font-semibold font-garamond hover:bg-blue-800 transition"
                        >
                            Submit Request
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestBusinessOwner;
