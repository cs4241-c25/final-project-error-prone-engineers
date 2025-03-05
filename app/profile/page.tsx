"use client";
import Banner from '@/components/Banner';
import React, {useEffect, useState} from 'react';
import { useSession, signOut } from "next-auth/react";
import Badge from '@/components/Badge';
import { getBadges } from '@/lib/badges';

const ProfilePage: React.FC = () => {
    const { data: session } = useSession();
    const [badges, setBadges] = useState<any[]>([]);
    const [selectedBadge, setSelectedBadge] = useState<any | null>(null);

    useEffect(() => {
        async function fetchBadges() {
            const badgeData = await getBadges();
            setBadges(badgeData);
        }
        fetchBadges();
    }, []);
    return (
        <div>
            <Banner />
            <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-[url('/freedomtrail_medallion.jpg')]" >
                <div className="bg-[#FFFFFF] p-0 rounded-3xl w-2/5 flex h-auto mb-36">

                    {/* Left Side */}
                    <div className='bg-[#0A2463] justify-items-center rounded-3xl w-1/5 p-4'>
                        <img src='/user.png' alt='User image' />
                        <button onClick={() => signOut()} className='bg-[#DCEDFF] text-[#0A2463] font-garamond text-xl rounded-full p-2 mt-4'>
                            Logout
                        </button>
                    </div>

                    {/* Right Side */}
                    <div className='bg-[#ffffff] w-4/5'>
                        <div className='flex-col'>
                            {/* User Info */}
                            <h2 className="text-4xl font-bold text-left text-blue-900 mb-6 font-garamond mt-14 ml-2">
                                {session?.user?.name}
                            </h2>
                            <hr className='border-[#0A2463]' />

                            <div className='flex'>
                                <div>
                                    <h2 className="text-xl font-bold text-right text-blue-900 mb-6 font-garamond mt-2 ml-2">Username:</h2>
                                    <h2 className="text-xl font-bold text-right text-blue-900 mb-6 font-garamond mt-2 ml-2">Email:</h2>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-left text-blue-900 mb-6 font-garamond mt-2 ml-2">{session?.user?.name}</h2>
                                    <h2 className="text-xl font-bold text-left text-blue-900 mb-6 font-garamond mt-2 ml-2">{session?.user?.email}</h2>
                                </div>
                            </div>

                            <hr className='border-[#0A2463]' />

                            {/* Badge Section with Horizontal Scrolling & Clickable Modal */}
                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold text-left text-blue-900 font-garamond mt-2 ml-2">Badges</h2>

                                {/* If there are no badges, show a message */}
                                {badges.length === 0 ? (
                                    <p className="text-blue-900 text-lg font-semibold font-garamond text-center mt-2 mb-2">
                                        No badges earned yet.
                                    </p>
                                ) : (
                                    /* Horizontal Scrollable Badge Container */
                                    <div className="overflow-x-auto whitespace-nowrap flex gap-6 pb-2 px-2">
                                        {badges.map((badge, index) => (
                                            <div
                                                key={index}
                                                className="cursor-pointer flex-shrink-0"
                                                onClick={() => setSelectedBadge(badge)}
                                            >
                                                <Badge
                                                    imageSrc={badge.image}
                                                    title={badge.badgeName}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Badge Description Modal */}
            {selectedBadge && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                     onClick={() => setSelectedBadge(null)}>
                    <div className="bg-white text-black p-6 rounded-lg max-w-md">
                        <h2 className="text-xl font-bold">{selectedBadge.badgeName}</h2>
                        <p className="mt-2">{selectedBadge.description}</p>
                        <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => setSelectedBadge(null)}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;