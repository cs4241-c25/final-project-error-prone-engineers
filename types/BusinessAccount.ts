export type BusinessAccount = {
    _id?: string;
    email?: string;
    ownerName: string;
    phoneNumber: string;
    businessEmail: string;
    businessName: string;
    businessType: string;
    addressLine1: string;
    addressLine2?: string;
    addressCity: string;
    addressState: string;
    addressZip: string;
    description: string;
    accessibility: boolean;
    publicRestroom: boolean;
}

export function address(account: BusinessAccount): string {
    const existingLine2: boolean = account.addressLine2 !== undefined && account.addressLine2.length > 0
    return account.addressLine1 + ", " + (existingLine2 ? account.addressLine2 + ", " : "") + account.addressCity
        + " " + account.addressState + " " + account.addressZip;
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

export function getEnumKeys<
    T extends string,
    TEnumValue extends string | number,
>(enumVariable: { [key in T]: TEnumValue }) {
    return Object.keys(enumVariable) as Array<T>;
}