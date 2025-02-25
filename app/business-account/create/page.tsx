'use client';

import { useState } from 'react';
import axios from 'axios';
import validator from 'validator';
import { BusinessAccount, BusinessType, getEnumKeys } from "@/types/BusinessAccount";
import {useSession} from "next-auth/react";

const createBusinessAccount = () => {

    const { data: session, status } = useSession();
    const loading: boolean = status === "loading";

    const [ownerName, setOwnerName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [businessType, setBusinessType] = useState(BusinessType.OTHER);
    const [address, setAddress] = useState("");
    const [description, setDescription] = useState("");
    const [accessibility, setAccessibility] = useState(false);
    const [publicRestroom, setPublicRestroom] = useState(false);
    const [error, setError] = useState("");

    function validateForm(): boolean {
        if (!ownerName) {
            setError("Name is required");
        }
        else if (!phoneNumber) {
            setError("Phone number is required");
        }
        else if (!validator.isMobilePhone(phoneNumber)) {
            setError("Phone number is not valid");
        }
        else if (!email) {
            setError("Email is required");
        }
        else if (!validator.isEmail(email)) {
            setError("Email is not valid");
        }
        else if (!businessName) {
            setError("Business name is required");
        }
        else if (!address) {
            setError("Address is required");
        }
        // TODO: validate address (multiple text boxes for address input?)
        else {
            setError("");
            return true;
        }
        return false;
    }

    async function submit() {
        if (validateForm()) {
            const formData: BusinessAccount = {
                email: session?.user?.email ?? "", ownerName: ownerName, phoneNumber: phoneNumber,
                businessEmail: email, businessName: businessName, businessType: businessType.valueOf(),
                address: address, description: description, accessibility: accessibility, publicRestroom: publicRestroom
            };
            const response = await axios.post('/api/business_account', formData);
            console.log(response);
        }
    }

    if (!loading && !session) {
        // TODO: redirect to homepage instead
        return <div><p>Please log in</p></div>;
    }
    else if (loading) {
        return <div><p>Loading...</p></div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-[url('/freedomtrail_medallion.jpg')] ">
            <div className="bg-[#DCEDFF] bg-opacity-20 backdrop-blur-lg p-4 rounded-3xl w-3/5 h-4/5">
                <h1 className='text-center text-blue-900 font-extrabold text-4xl font-garamond'>Add Your Business</h1>
                <div className='flex flex-row items-center justify-center'>
                    {/* left div */}
                    <div className='flex flex-col ml-2 mr-5 w-1/2'>
                        <label className="text-blue-900 font-garamond text-l font-semibold mb-1">Owner Name:</label>
                        <input type="text" id="ownerName" name="ownerName" value={ownerName} placeholder="Owner name"
                            className="w-full p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto"
                            onChange={(e) => setOwnerName(e.target.value)} /><br/>
                        <label className="text-blue-900 font-garamond text-l font-semibold mb-1">Phone Number:</label>
                        <input type="text" id="phoneNumber" name="phoneNumber" value={phoneNumber} placeholder="Phone number"
                            className="w-full p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto"
                            onChange={(e) => setPhoneNumber(e.target.value)} /><br/>
                        <label className="text-blue-900 font-garamond text-l font-semibold mb-1">Business Email:</label>
                        <input type="text" id="email" name="email" value={email} placeholder="Email"
                            className="w-full p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto"
                            onChange={(e) => setEmail(e.target.value)} /><br/>
                        <div className='flex justify-end'>
                            <p className="text-blue-900 font-garamond text-l font-semibold mb-1 justify-end mt-5">Wheelchair Accessible?
                                <input type="checkbox" id="accessibility" name="accessibility" checked={accessibility}
                                    className="p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto ml-5"
                                    onChange={(e) => setAccessibility(e.target.checked)} />
                            </p>
                        </div>
                    </div>
                    {/* right div */}
                    <div className='flex flex-col ml-5 mr-2 w-1/2'>
                        <label className="text-blue-900 font-garamond text-l font-semibold mb-1 justify-start">Business Name:</label>
                        <input type="text" id="businessName" name="businessName" value={businessName} placeholder="Business name"
                            className="w-full p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto"
                            onChange={(e) => setBusinessName(e.target.value)} /><br/>
                        <label className="text-blue-900 font-garamond text-l font-semibold mb-1">Business Type:</label>
                        <select id="businessType" name="businessType" value={businessType}
                            className="w-full p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto"
                            onChange={(e) => setBusinessType(BusinessType[e.target.value as keyof typeof BusinessType])}>
                            {getEnumKeys(BusinessType).map((key, index) => (
                                <option key={index} value={BusinessType[key]}>{BusinessType[key]}</option>
                            ))}
                        </select>
                        <label className="text-blue-900 font-garamond text-l font-semibold mb-1">Business Address:</label>
                        <input type="text" id="address" name="address" value={address} placeholder="Address"
                            className="w-full p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto"
                            onChange={(e) => setAddress(e.target.value)} /><br/>
                        <p className="text-blue-900 font-garamond text-l font-semibold mb-1 mt-5">Public Restroom?
                            <input type="checkbox" id="publicRestroom" name="publicRestroom" checked={publicRestroom}
                                className="p-3 rounded-full bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto ml-5"
                                onChange={(e) => setPublicRestroom(e.target.checked)} />
                        </p>
                    </div>

                </div>

                <div className='flex flex-col items-center'>
                    <label className="text-blue-900 font-garamond text-l font-semibold mb-1 justify-center">Business Description:</label>
                    <textarea rows={5} id="description" name="description" value={description} placeholder="Business Description"
                            className="w-4/5 p-3 rounded-md font-garamond bg-[#2F1000] bg-opacity-50 text-white justify-center focus:outline-none mb-1 h-auto ml-5"
                            onChange={(e) => setDescription(e.target.value)} /><br/>
                    <input type="submit" value="Create Your Business" className="w-3/5 bg-blue-900 font-garamond mb-4 mt-2 text-white p-2 justify-center text-center rounded-full text-xl font-bold hover:bg-blue-800 transition"
                        onClick={submit} />
                    <p>{error}</p>
                </div>
            </div>
        </div>
    );
}

export default createBusinessAccount;

