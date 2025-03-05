export type BusinessAccount = {
    _id?: string;
    email?: string;
    ownerName: string;
    phoneNumber: string;
    businessEmail: string;
    node?: Node;
    addressParts: AddressParts;
}

export type Node = {
    _id?: string;
    name: string;
    type: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    accessibility?: boolean;
    publicRestroom?: boolean;
}

export type AddressParts = {
    line1: string;
    line2: string;
    city: string;
    state: string;
    country: string;
    zip: string;
}

export function address(a: AddressParts): string {
    const existingLine2: boolean = a.line2 !== undefined && a.line2.length > 0;
    return a.line1 + ", " + (existingLine2 ? a.line2 + ", " : "") + a.city + " " + a.state + " " + a.zip;
}

export function formatPhoneNumber(phoneNumberString: string): string {
    let cleaned: string = ('' + phoneNumberString).replace(/\D/g, '');
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return phoneNumberString;
}

export enum BusinessType {
    RESTAURANT = "Restaurant",
    FAST_FOOD = "Fast Food",
    CAFE = "Cafe",
    GIFT_SHOP = "Gift Shop",
    BOOKSTORE = "Book Store",
    HOTEL = "Hotel",
    RESTROOM = "Restroom",
    OTHER = "Other"
}

export function getEnumKeys<T extends string, TEnumValue extends string | number>
(enumVariable: { [key in T]: TEnumValue }): T[] {
    return Object.keys(enumVariable) as Array<T>;
}