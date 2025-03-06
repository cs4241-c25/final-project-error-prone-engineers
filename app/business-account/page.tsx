'use client';

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BusinessAccount, address } from "@/types/BusinessAccount";
import {useSession} from "next-auth/react";
import Link from "next/link";
import Banner from "@/components/PlainBanner";

const businessAccount = () => {

    const router = useRouter();
    const { data: session, status } = useSession();
    const loadingSession: boolean = status === "loading";

    const [businessAccounts, setBusinessAccounts] = useState<BusinessAccount[]>([]);
    const [reload, setReload] = useState<boolean>(true);

    useEffect(() => {
        async function loadAccounts() {
            if (session) {
                const response = await axios.get('/api/business_account',
                    {params: {email: session?.user?.email}});
                setBusinessAccounts(response.data.businesses);
            }
        }
        loadAccounts().then();
    }, [loadingSession, reload])

    if (!loadingSession && !session) {
        router.push('/');
    }
    else if (loadingSession) {
        return <div><p>Loading...</p></div>;
    }

    const deleteAccount = (businessAccount: BusinessAccount) => {
        axios.delete('/api/business_account', {params: {_id: businessAccount._id}})
            .then(() => setReload(!reload));
    }

    const tableRow = (business: BusinessAccount) => {
        return (
            <tr key={business._id} className='text-blue-900'>
                <td className='border border-blue-900 p-1 bg-[#DCEDFF]'>{business.node!.name}</td>
                <td className='border border-blue-900 p-1 bg-[#DCEDFF]'>{business.node!.type}</td>
                <td className='border border-blue-900 p-1 bg-[#DCEDFF]'>{address(business.addressParts)}</td>
                <td className='border border-blue-900 p-1 bg-[#DCEDFF]'>{business.ownerName}</td>
                <td className='border border-blue-900 p-1 bg-[#DCEDFF]'>{business.businessEmail}</td>
                <td className='border border-blue-900 p-1 bg-[#DCEDFF]'>{business.phoneNumber}</td>
                <td className='justify-center text-center'>
                    <button className='text-white ml-2 bg-blue-900 px-1 rounded-sm hover:bg-blue-700 transition'><Link href={{pathname: "/business-account/edit", query: {_id: business._id}}}>Edit</Link></button>
                </td>
                <td className='justify-center text-center'>
                    <button className='text-white ml-2 bg-blue-900 px-1 rounded-sm hover:bg-blue-700 transition' onClick={() => deleteAccount(business)}>Delete</button>
                </td>
            </tr>
        );
    }

    return (
        <div>
            <Banner></Banner>
        <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-[url('/freedomtrail_medallion.jpg')] ">
            <div className="bg-white p-4 rounded-3xl w-3/5 h-4/5">
                <button className='text-white ml-2 bg-blue-900 px-2 text-xl rounded-md hover:bg-blue-700 transition font-garamond'
                        onClick={() => router.push('/business-account/create')}>Create New Business</button>
                {/* ^ I hate this button I hate it I hate it I hate it */}
                <table className='font-garamond'>
                    <thead className='text-center text-xl font-bold'>
                        <tr>
                            <td className='border border-white bg-blue-900 p-2'>Business Name</td>
                            <td className='border border-white bg-blue-900 p-2'>Business Type</td>
                            <td className='border border-white bg-blue-900 p-2'>Address</td>
                            <td className='border border-white bg-blue-900 p-2'>Owner Name</td>
                            <td className='border border-white bg-blue-900 p-2'>Email</td>
                            <td className='border border-white bg-blue-900 p-2'>Phone Number</td>
                            <td className='p-2'></td>
                            <td className='p-2'></td>
                        </tr>
                    </thead>
                    <tbody className='text-lg font-semibold'>
                        {businessAccounts.map((account) => tableRow(account))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
}

export default businessAccount;

