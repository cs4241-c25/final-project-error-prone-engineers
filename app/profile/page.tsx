"use client";
import Banner from '@/components/Banner';
import React, {useEffect, useState} from 'react';
import { useSession, signOut } from "next-auth/react";
import Badge from '@/components/Badge';
import { getBadges } from '@/lib/badges';

const ProfilePage: React.FC = () => {
    const { data: session } = useSession();
    const [badges, setBadges] = useState<any[]>([]);

    useEffect(() => {
        async function fetchBadges() {
            const badgeData = await getBadges();
            setBadges(badgeData);
        }
        fetchBadges();
    }, []);
    return (
        <div>
            <Banner></Banner>
            <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-[url('/freedomtrail_medallion.jpg')] " >
            <div className="bg-[#FFFFFF] p-0 rounded-3xl w-2/5 flex h-96 mb-36">
                
                {/* Left Side */}
                <div className='bg-[#0A2463] justify-items-center rounded-3xl w-1/5 p-4'>
                    {/* User Image */}
                    <img src='/user.png' alt='user image'/>

                    {/* Logout button */}
                    <button onClick={() => signOut()} className='bg-[#DCEDFF] text-[#0A2463] font-garamond text-xl rounded-full p-2 mt-4'>Logout</button>
                </div>
                
                {/* Right Side */}
                <div className='bg-[#ffffff] w-4/5'>
                    <div className='flex-col'>
                        {/* User's name */}
                        <div><h2 className="text-4xl font-bold text-left text-blue-900 mb-6 font-garamond mt-14 ml-2">{session?.user?.name}</h2></div>
                        
                        <hr className='border-[#0A2463]'></hr>

                        {/* User information */}
                        <div className='flex'>
                            {/* Left side of info */}
                            <div>
                                
                                <h2 className="text-xl font-bold text-right text-blue-900 mb-6 font-garamond mt-2 ml-2">Username:</h2>

                                <h2 className="text-xl font-bold text-right text-blue-900 mb-6 font-garamond mt-2 ml-2">Email:</h2>
                            </div>
                            
                            <div></div>

                            {/* Right side of info */}
                            <div>
                                
                                <h2 className="text-xl font-bold text-left text-blue-900 mb-6 font-garamond mt-2 ml-2">{session?.user?.name}</h2>
                            
                                <h2 className="text-xl font-bold text-left text-blue-900 mb-6 font-garamond mt-2 ml-2">{session?.user?.email}</h2>
                                
                            </div>

                        </div>
                        
                        <hr className='border-[#0A2463]'></hr>

                        {/* Badge section */}
                        <h2 className="text-xl font-bold text-left text-blue-900 font-garamond mt-2 ml-2">Badges</h2>

                        <div className='flex overflow-x-auto whitespace-nowrap justify-start px-2 gap-4'>
                            {badges.length > 0 ? (
                                badges.map((badge, index) => (
                                    <Badge key={index} imageSrc={badge.image} title={badge.name} />
                                ))
                            ) : (
                                <p className="text-blue-900 text-xl ml-2">No badges earned yet.</p>
                            )}
                        </div>

                    </div>
                    
                </div>

                
            </div>
    </div>
        </div>
        
    );
};

export default ProfilePage;