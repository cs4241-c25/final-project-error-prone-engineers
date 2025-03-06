'use client';
import { useRouter } from "next/navigation";
import { useState } from 'react';
import axios from 'axios';
import validator from 'validator';
import {
    address,
    AddressParts,
    BusinessAccount,
    BusinessType,
    Node,
    getEnumKeys,
    formatPhoneNumber
} from "@/types/BusinessAccount";
import { bostonZipCodes} from "@/types/Location";
import {useSession} from "next-auth/react";
import Banner from "@/components/Banner";

const createBusinessAccount = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const loading: boolean = status === "loading";

    const [ownerName, setOwnerName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [businessName, setBusinessName] = useState("");
    const [businessType, setBusinessType] = useState(BusinessType.OTHER);
    const [addressStreet, setAddressStreet] = useState("");
    const [addressApt, setAddressApt] = useState("");
    const [addressCity, setAddressCity] = useState("Boston");
    const [addressState, setAddressState] = useState("MA");
    const [addressZip, setAddressZip] = useState("01209");
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
        else if (!addressStreet || !addressCity || !addressState || !addressZip) {
            setError("Address is required");
        }
        else if (!/^[0-9]+\s[a-zA-Z\s]+$/.test(addressStreet)) {
            setError("Street address is not valid");
        }
        else if (addressState !== "MA") {
            setError("State must be 'MA'")
        }
        else if (!bostonZipCodes.includes(addressZip)) {
            setError("Zip code must be in Boston")
        }
        else {
            setError("");
            return true;
        }
        return false;
    }

    async function submit() {
        if (validateForm()) {
            const addressP: AddressParts = {
                line1: addressStreet, line2: addressApt, city: addressCity,
                state: addressState, country: "United States", zip: addressZip
            };

            const node: Node = {
                name: businessName, type: businessType.valueOf(), description: description, address: address(addressP),
                coordinates: [0, 0], accessibility: accessibility, publicRestroom: publicRestroom
            };

            const formData: BusinessAccount = {
                email: session?.user?.email ?? "", ownerName: ownerName, phoneNumber: phoneNumber,
                businessEmail: email, node: node, addressParts: addressP
            };
            const response = await axios.post('/api/business_account', formData);
            console.log(response);
            if (response.status === 200) {
                router.push('/business-account');
            }
            else {
                setError("There was an error while submitting your business account");
            }
        }
    }

    if (!loading && !session) {
        router.push('/');
    }
    else if (loading) {
        return <div><p>Loading...</p></div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center bg-[url('/freedomtrail_medallion.jpg')] ">
            <div className="bg-white p-4 rounded-3xl w-3/5 h-4/5">
                <h1 className="bg-blue-900 p-2 rounded-md text-6xl font-bold text-center text-white mb-6 font-cinzel_decorative">Add Your Business</h1>
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
                            onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))} /><br/>
                        <label className="text-blue-900 font-garamond text-l font-semibold mb-1">Business Email:</label>
                        <input type="text" id="email" name="email" value={email} placeholder="Email"
                            className="w-full p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto"
                            onChange={(e) => setEmail(e.target.value)} /><br/>
                        <label className="text-blue-900 font-garamond text-l font-semibold mb-1 justify-start">Business Name:</label>
                        <input type="text" id="businessName" name="businessName" value={businessName} placeholder="Business name"
                            className="w-full p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto"
                            onChange={(e) => setBusinessName(e.target.value)} /><br/>
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
                        <label className="text-blue-900 font-garamond text-l font-semibold mb-1">Business Type:</label>
                        <select id="businessType" name="businessType" value={businessType}
                            className="w-full p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto"
                            onChange={(e) => setBusinessType(e.target.value as BusinessType)}>
                            {getEnumKeys(BusinessType).map((key, index) => (
                                <option key={index} value={BusinessType[key]}>{BusinessType[key]}</option>
                            ))}
                        </select>
                        <label className="text-blue-900 font-garamond text-l font-semibold mb-1">Street Address:</label>
                        <input type="text" id="addressStreet" name="addressStreet" value={addressStreet} placeholder="Street Address"
                            className="w-full p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto"
                            onChange={(e) => setAddressStreet(e.target.value)} /><br/>
                        <label className="text-blue-900 font-garamond text-l font-semibold mb-1">Apt # or Suite:</label>
                        <input type="text" id="addressApt" name="addressApt" value={addressApt} placeholder="Apt # or Suite"
                            className="w-full p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto"
                            onChange={(e) => setAddressApt(e.target.value)} /><br/>
                        <div className='flex flex-row'>
                            <div className='flex flex-col mr-1'>
                                <label className="text-blue-900 font-garamond text-l font-semibold mb-1">City:</label>
                                <input type="text" id="addressCity" name="addressCity" value={addressCity} placeholder="City"
                                    className="w-full p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto"
                                    onChange={(e) => setAddressCity(e.target.value)} /><br/>
                            </div>
                            <div className='flex flex-col mr-1'>
                                <label className="text-blue-900 font-garamond text-l font-semibold mb-1">State:</label>
                                <input type="text" id="addressState" name="addressState" value={addressState} placeholder="State"
                                    className="w-full p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto"
                                    onChange={(e) => setAddressState(e.target.value)} /><br/>
                            </div>
                            <div className='flex flex-col'>
                                <label className="text-blue-900 font-garamond text-l font-semibold mb-1">Zip Code:</label>
                                <input type="text" id="addressZip" name="addressZip" value={addressZip} placeholder="Zip Code"
                                    className="w-full p-3 rounded-full font-garamond bg-[#2F1000] bg-opacity-50 text-white focus:outline-none mb-1 h-auto"
                                    onChange={(e) => setAddressZip(e.target.value)} /><br/>
                            </div>
                        </div>
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

