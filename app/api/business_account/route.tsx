import { MongoClient } from "mongodb";
import { BusinessAccount } from "@/types/BusinessAccount";
import {NextRequest, NextResponse} from "next/server";

const dbconnect = new MongoClient(process.env.MONGO_URI!);
let businessesCollection: any = null;

async function connectDB() {
    if (!businessesCollection) {
        await dbconnect.connect();
        const db = dbconnect.db("freedom-trail");
        businessesCollection = db.collection("businesses");
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const formData: BusinessAccount = await request.json();
        const result = await businessesCollection.insertOne(formData);
        console.log(result);
        return NextResponse.json({ status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ status: 400 });
    }
}

export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const email: string | null = request.nextUrl.searchParams.get("email");
        const businesses: [BusinessAccount] = await businessesCollection.find({email: email}).toArray();
        return NextResponse.json({ status: 200, businesses });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ status: 400 });
    }
}
