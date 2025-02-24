'use client';

import { useState } from 'react';
import axios from 'axios';
import validator from 'validator';
import { BusinessAccount, BusinessType, getEnumKeys } from "@/types/BusinessAccount";

const createBusinessAccount = () => {

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
                ownerName: ownerName, phoneNumber: phoneNumber,
                email: email, businessName: businessName, businessType: businessType, address: address,
                description: description, accessibility: accessibility, publicRestroom: publicRestroom
            };
            const response = await axios.post('/api/business_account', formData);
            console.log(response);
        }
    }

    return (
        <div>
            <h1>Add Your Business</h1>
            <input type="text" id="ownerName" name="ownerName" value={ownerName} placeholder="Owner name"
                   onChange={(e) => setOwnerName(e.target.value)} /><br/>
            <input type="text" id="phoneNumber" name="phoneNumber" value={phoneNumber} placeholder="Phone number"
                   onChange={(e) => setPhoneNumber(e.target.value)} /><br/>
            <input type="text" id="email" name="email" value={email} placeholder="Email"
                   onChange={(e) => setEmail(e.target.value)} /><br/>
            <input type="text" id="businessName" name="businessName" value={businessName} placeholder="Business name"
                   onChange={(e) => setBusinessName(e.target.value)} /><br/>
            <p>Business Type:
                <select id="businessType" name="businessType" value={businessType}
                        onChange={(e) => setBusinessType(BusinessType[e.target.value as keyof typeof BusinessType])}>
                    {getEnumKeys(BusinessType).map((key, index) => (
                        <option key={index} value={BusinessType[key]}>{BusinessType[key]}</option>
                    ))}
                </select>
            </p>
            <input type="text" id="address" name="address" value={address} placeholder="Address"
                   onChange={(e) => setAddress(e.target.value)} /><br/>
            <p>Wheelchair Accessible?
                <input type="checkbox" id="accessibility" name="accessibility" checked={accessibility}
                   onChange={(e) => setAccessibility(e.target.checked)} />
            </p>
            <p>Public Restroom?
                <input type="checkbox" id="publicRestroom" name="publicRestroom" checked={publicRestroom}
                   onChange={(e) => setPublicRestroom(e.target.checked)} />
            </p>
            <textarea rows={5} id="description" name="description" value={description} placeholder="Business Description"
                   onChange={(e) => setDescription(e.target.value)} /><br/>
            <input type="submit" value="Create Your Business" onClick={submit} />
            <p>{error}</p>
        </div>
    );
}

export default createBusinessAccount;

