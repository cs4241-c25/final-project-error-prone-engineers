import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import {connectDB} from "@/lib/database";

export async function POST(req: Request) {
    try {
        let userCollection = await connectDB("users");

        // Parse JSON body
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await userCollection.findOne({ email });

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        if (existingUser) {
            if (existingUser.password) {
                // User already exists and has a password → block registration
                return NextResponse.json({ error: "User already exists" }, { status: 400 });
            } else {
                // User exists (e.g., via Google) and has no password → set fallback password
                await userCollection.updateOne(
                    { email },
                    { $set: { password: hashedPassword } }
                );
                return NextResponse.json({ message: "Password set successfully" }, { status: 200 });
            }
        } else {
            // New user → create entry
            const result = await userCollection.insertOne({
                email,
                password: hashedPassword,
                createdAt: new Date(),
                role: "user",
            });

            return NextResponse.json(
                { message: "User registered successfully", insertedId: result.insertedId },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
