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

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const result = await userCollection.insertOne({
            email,
            password: hashedPassword,
            createdAt: new Date(),
        });

        return NextResponse.json(
            { message: "User registered successfully", insertedId: result.insertedId },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
