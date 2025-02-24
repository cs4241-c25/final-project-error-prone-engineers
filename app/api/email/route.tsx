import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { MongoClient } from "mongodb";

const dbconnect = new MongoClient(process.env.MONGO_URI!);
let userCollection: any = null;

async function connectDB() {
    if (!userCollection) {
        await dbconnect.connect();
        const db = dbconnect.db("freedom-trail");
        userCollection = db.collection("users");
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const email = body.email;


        if (!email) {
            return NextResponse.json({ message: "Recipient email is required" }, { status: 400 });
        }

        await connectDB();
        const user = await userCollection.findOne({ email });
        if (!user) {
            return NextResponse.json({ error: "Email does not exist in database" }, { status: 404 });
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
            to: email,
            subject: "Your Freedom Trail Application Password Reset Link",
            html: `
                <p>Hello,</p>
                <p>We received a request to reset your password. Click the button below to proceed:</p>
                <p><a href="http://localhost:3000/reset-password?email=${email}" style="background:blue;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a></p>
                <p>If you did not request this, you can ignore this email.</p>
                <p>Thank you,</p>
                <p>The Support Team</p>
              `,
        };

        const info = await transporter.sendMail(mailOptions);

        return NextResponse.json({ message: "Email sent successfully!", info }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Error sending email", error: error.message }, { status: 500 });
    }
}
