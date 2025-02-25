'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import validator from 'validator';
import { BusinessAccount, BusinessType, getEnumKeys } from "@/types/BusinessAccount";
import {useSession} from "next-auth/react";

const businessAccount = () => {

    const { data: session, status } = useSession();
    const loading: boolean = status === "loading";

    const [businessAccounts, setBusinessAccounts] = useState<BusinessAccount[]>([]);

    useEffect(() => {
        async function loadAccounts() {
            if (session) {
                const response = await axios.get('/api/business_account',
                    {params: {email: session?.user?.email}});
                setBusinessAccounts(response.data.businesses);
            }
        }
        loadAccounts().then();
    }, [loading, session])

    if (!loading && !session) {
        // TODO: redirect to homepage instead
        return <div><p>Please log in</p></div>;
    }
    else if (loading) {
        return <div><p>Loading...</p></div>;
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
            </tr>
            </thead>
            <tbody>
            {businessAccounts.map((account) => tableRow(account))}
            </tbody>
        </table>
    );
}

export default businessAccount;

