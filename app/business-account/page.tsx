'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { BusinessAccount } from "@/types/BusinessAccount";
import {useSession} from "next-auth/react";
import Link from "next/link";

const businessAccount = () => {

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
        // TODO: redirect to homepage instead
        return <div><p>Please log in</p></div>;
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
            <tr key={business._id}>
                <td className='border border-white p-1'>{business.businessName}</td>
                <td className='border border-white p-1'>{business.businessType}</td>
                <td className='border border-white p-1'>{business.address}</td>
                <td className='border border-white p-1'>{business.ownerName}</td>
                <td className='border border-white p-1'>{business.businessEmail}</td>
                <td className='border border-white p-1'>{business.phoneNumber}</td>
                <td className='justify-center text-center'>
                    <button className='ml-2 bg-blue-900 px-1 rounded-sm hover:bg-blue-700 transition'><Link href={{pathname: "/business-account/edit", query: {_id: business._id}}}>Edit</Link></button>
                </td>
                <td className='justify-center text-center'>
                    <button className='ml-2 bg-blue-900 px-1 rounded-sm hover:bg-blue-700 transition' onClick={() => deleteAccount(business)}>Delete</button>
                </td>
            </tr>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-[url('/freedomtrail_medallion.jpg')] ">
            <div className="bg-[#DCEDFF] bg-opacity-20 backdrop-blur-lg p-4 rounded-3xl w-3/5 h-4/5">
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
    );
}

export default businessAccount;

