import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const userCollection = await connectDB("users");

        // Parse JSON body
        const body = await req.json();
        const email= body.email;
        const name = body.name;
        const description = body.description;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await userCollection.findOne({ email });

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Update role to 'pending'
        const result = await userCollection.updateOne(
            { email },
            { $set: { role: "pending" } }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: "User role update failed" }, { status: 500 });
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

        // send mail to user
        const mailOptionsToUser = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: "Your Freedom Trail Business Account Request",
            html: `
                <p>Hello,</p>
                <p>We received a request to have your account updated to a business account. 
                We will look into that request and update it accordingly. Feel free to email us if you have any more questions. </p>
                <p>If you did not request this, you can ignore this email.</p>
                <p>Thank you,</p>
                <p>- The Freedom Trail Tour Support Team</p>
              `,
        };
        await transporter.sendMail(mailOptionsToUser);

        // send mail to owner
        const mailOptionsToAdmin = {
            from: process.env.GMAIL_USER,
            to: process.env.GMAIL_USER,
            subject: "Freedom Trail Business Account Request from a User",
            html: `
                <p>Hello Admin,</p>
                <p><strong>A user has requested a Business Owner account.</strong></p>
                <p><strong>Full Name:</strong> ${name}</p>
                <p><strong>Reason for Request:</strong><br/>${description}</p>
                <hr/>
                <p>You may review the request and update their role in the system accordingly.</p>
                <p>— The Freedom Trail Tour Support Team</p>
            `,
        };
        await transporter.sendMail(mailOptionsToAdmin);

        return NextResponse.json({ message: "User role updated to pending" }, { status: 200 });
    } catch (error) {
        console.error("Role update error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
