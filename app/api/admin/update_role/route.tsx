import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import nodemailer from "nodemailer";
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { userId, role } = body;

        if (!userId || !role) {
            return NextResponse.json({ error: "User ID and new role are required" }, { status: 400 });
        }

        const userCollection = await connectDB("users");
        const result = await userCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $set: { role } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ✅ Fetch user to get email
        const updatedUser = await userCollection.findOne({ _id: new ObjectId(userId) });
        if (!updatedUser?.email) {
            return NextResponse.json({ error: "User email not found" }, { status: 404 });
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: updatedUser.email,
            subject: "Freedom Trail Role Update",
            html: `
                <p>Hello,</p>
                <p>You requested to have your account changed to a business account. It has been updated to <strong>${role}</strong>.</p>
                <p>Thank you,</p>
                <p>— The Freedom Trail Tour Support Team</p>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "User role updated and email sent successfully." }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
