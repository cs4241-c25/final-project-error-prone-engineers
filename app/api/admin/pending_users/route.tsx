import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";

export async function GET() {
    try {
        const userCollection = await connectDB("users");
        const users = await userCollection.find({ role: "pending" }).toArray();

        return NextResponse.json({ users }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch pending users", detail: error.message }, { status: 500 });
    }
}