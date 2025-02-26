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
                <td>{business.businessName}</td>
                <td>{business.businessType}</td>
                <td>{business.address}</td>
                <td>{business.ownerName}</td>
                <td>{business.businessEmail}</td>
                <td>{business.phoneNumber}</td>
                <td><button><Link href={{pathname: "/business-account/edit", query: {_id: business._id}}}>Edit</Link></button></td>
                <td><button onClick={() => deleteAccount(business)}>Delete</button></td>
            </tr>
        );
    }

    return (
        <table>
            <thead>
            <tr>
                <td>Business Name</td>
                <td>Business Type</td>
                <td>Address</td>
                <td>Owner Name</td>
                <td>Email</td>
                <td>Phone Number</td>
                <td></td>
                <td></td>
            </tr>
            </thead>
            <tbody>
            {businessAccounts.map((account) => tableRow(account))}
            </tbody>
        </table>
    );
}

export default businessAccount;

