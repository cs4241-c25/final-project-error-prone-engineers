import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {connectDB} from "@/lib/database";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, newPassword } = body;

        if (!email || !newPassword) {
            return NextResponse.json({ message: "Email and new password are required" }, { status: 400 });
        }

        let userCollection = await connectDB("users");
        const user = await userCollection.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }


        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await userCollection.updateOne({ email }, { $set: { password: hashedPassword } });

        return NextResponse.json({ message: "Password reset successfully!" }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
