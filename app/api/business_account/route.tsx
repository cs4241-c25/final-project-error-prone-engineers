import { BusinessAccount } from "@/types/BusinessAccount";
import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/lib/database";
import { ObjectId } from "mongodb";

export async function POST(request: NextRequest) {
    try {
        const formData: BusinessAccount = await request.json();
        let businessesCollection = await connectDB("businesses");

        const businessToInsert = {
            ...formData,
            _id: formData._id ? new ObjectId(formData._id) : undefined,
        };

        const result = await businessesCollection.insertOne(businessToInsert);
        console.log(result);
        return NextResponse.json({ status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ status: 400 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        let businessesCollection = await connectDB("businesses");
        const formData: BusinessAccount = await request.json();
        const _id = formData._id;
        delete formData._id;
        delete formData.email;
        const result = await businessesCollection.updateOne({_id: new ObjectId(_id)}, {$set: formData});
        console.log("Edited " + result.modifiedCount + " task with ID " + _id);
        return NextResponse.json({ status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ status: 400 });
    }
}

export async function GET(request: NextRequest) {
    try {
        let businessesCollection = await connectDB("businesses");
        const email: string | null = request.nextUrl.searchParams.get("email");
        const _id: string | null = request.nextUrl.searchParams.get("_id");

        if (email) {
            const businesses = await businessesCollection.find({ email }).toArray();
            return NextResponse.json({ status: 200, businesses: businesses.map(b => ({ ...b, _id: b._id.toString() }) as BusinessAccount) });
        }
        else if (_id) {
            const business = await businessesCollection.findOne({ _id: new ObjectId(_id) });
            return NextResponse.json({ status: 200, business: business ? { ...business, _id: business._id.toString() } as BusinessAccount : null });
        }
        else {
            const businesses = await businessesCollection.find({}).toArray();
            return NextResponse.json({ status: 200, businesses: businesses.map(b => ({ ...b, _id: b._id.toString() }) as BusinessAccount) });
        }
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ status: 400 });
    }
}


export async function DELETE(request: NextRequest) {
    try {
        let businessesCollection = await connectDB("businesses");
        const _id: string = request.nextUrl.searchParams.get("_id")!;
        const result = await businessesCollection.deleteOne({
            _id: new ObjectId(_id),
        });
        console.log("Deleted " + result.deletedCount + " task with ID " + _id);
        return NextResponse.json({ status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ status: 400 });
    }
}
