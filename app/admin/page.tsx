'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from "next-auth/react";
import Banner from "@/components/PlainBanner";

interface PendingUser {
    _id: string;
    name: string;
    email: string;
    role: string;
}

const AdminUserReviewPage = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const loadingSession = status === "loading";

    useEffect(() => {
        async function loadPendingUsers() {
            if (session?.user?.role === "admin") {
                const response = await axios.get('/api/admin/pending_users');
                setPendingUsers(response.data.users);
            }
        }
        loadPendingUsers();
    }, [session]);

    const updateRole = async (userId: string, newRole: string) => {
        await axios.post('/api/admin/update_role', {
            userId,
            role: newRole
        });
        setPendingUsers(pendingUsers.filter(user => user._id !== userId));
    };

    if (!loadingSession && session?.user?.role !== "admin") {
        router.push('/');
        return null;
    }

    return (
        <div>
            <Banner />
            <div className="flex flex-col items-center justify-center min-h-screen bg-[url('/freedomtrail_medallion.jpg')] bg-cover bg-center">
                <div className="bg-white p-4 rounded-3xl w-11/12 md:w-3/5 h-auto md:h-4/5">
                    <h2 className="text-3xl font-bold font-cinzel_decorative text-blue-900 text-center mb-4">
                        Review Pending Business Owners
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="w-full font-garamond">
                            <thead className="text-xl text-white bg-blue-900">
                            <tr>
                                <th className="p-2 border border-white">Name</th>
                                <th className="p-2 border border-white">Email</th>
                                <th className="p-2 border border-white">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="text-lg font-semibold text-blue-900">
                            {pendingUsers.map((user) => (
                                <tr key={user._id}>
                                    <td className="p-2 border bg-[#DCEDFF]">{user.name}</td>
                                    <td className="p-2 border bg-[#DCEDFF]">{user.email}</td>
                                    <td className="p-2 border bg-[#DCEDFF] text-center space-y-2 md:space-y-0 md:space-x-2">
                                        <button
                                            onClick={() => updateRole(user._id, "business_owner")}
                                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => updateRole(user._id, "user")}
                                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                                        >
                                            Reject
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminUserReviewPage;
