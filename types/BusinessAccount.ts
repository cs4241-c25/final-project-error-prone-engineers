export type BusinessAccount = {
    ownerName: string;
    phoneNumber: string;
    email: string;
    businessName: string;
    businessType: BusinessType;
    address: string;
    description: string;
    accessibility: boolean;
    publicRestroom: boolean;
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