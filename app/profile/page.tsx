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
        <div className='flex flex-col min-h-screen'>
            <Banner />
            <div className="flex flex-grow items-center justify-center bg-cover bg-center bg-[url('/freedomtrail_medallion.jpg')] w-screen">
                <div className="bg-white p-5 rounded-3xl max-w-full lg:w-4/5 sm:w-4/5 h-[60vh] flex flex-row justify-center items-center">

                    {/* Left Side */}
                    <div className='bg-[#0A2463] justify-items-center rounded-3xl lg:w-1/5 p-4 h-full'>
                        <img src='/user.png' alt='User image' />
                        <button onClick={() => signOut()} className='bg-[#DCEDFF] text-[#0A2463] font-garamond lg:text-xl text-xs text-center justify-center rounded-full px-2 mt-4 w-full hover:bg-[#5CABFF]'>
                            Logout
                        </button>
                    </div>

                    {/* Right Side */}
                    <div className='bg-white w-4/5 ml-5 h-full'>
                        <div className='flex-col h-full justify-center py-[5%]'>
                            {/* User Info */}
                            <h2 className="lg:text-4xl sm:text-lg break-all text-wrap font-bold text-left text-blue-900 font-cinzel_decorative ml-2 w-4/5">
                                {session?.user?.name}
                            </h2>
                            <hr className='border-[#0A2463] my-5' />

                            <div className='flex'>
                                <div>
                                    <h2 className="lg:text-xl font-bold text-right text-blue-900 mb-6 font-garamond mt-2 ml-2">Username:</h2>
                                    <h2 className="lg:text-xl font-bold text-right text-blue-900 mb-6 font-garamond mt-2 ml-2">Email:</h2>
                                </div>

                                <div>
                                    <h2 className="lg:text-xl break-all font-bold text-left text-blue-900 mb-6 font-garamond mt-2 ml-2">{session?.user?.name}</h2>
                                    <h2 className="lg:text-xl break-all font-bold text-left text-blue-900 mb-6 font-garamond mt-2 ml-2">{session?.user?.email}</h2>
                                </div>
                            </div>

                            <hr className='border-[#0A2463] my-5' />

                            {/* Badge Section with Horizontal Scrolling & Clickable Modal */}
                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold text-left text-blue-900 font-garamond mt-2 lg:mb-3 ml-2">Badges</h2>

                                {/* If there are no badges, show a message */}
                                {badges.length === 0 ? (
                                    <p className="text-blue-900 text-lg font-semibold font-garamond text-center mt-2 mb-2">
                                        No badges earned yet.
                                    </p>
                                ) : (
                                    /* Horizontal Scrollable Badge Container */
                                    <div className="overflow-x-auto whitespace-nowrap flex gap-6 pb-2 px-2 mt-2">
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
                    <div className="bg-white p-4 rounded-lg max-w-md relative">
                        <button className="text-gray-600 hover:underline text-xs absolute top-1 right-1"
                                onClick={() => setSelectedBadge(null)}>
                            ✕
                        </button>
                        <h2 className="text-xl text-center bg-blue-900 text-white font-cinzel_decorative font-bold w-full p-2 rounded-md">{selectedBadge.badgeName}</h2>
                        <p className="mt-2 text-blue-900 font-garamond font-semibold text-xl">{selectedBadge.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;