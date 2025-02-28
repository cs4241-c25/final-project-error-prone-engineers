import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const dbconnect = new MongoClient(process.env.MONGO_URI!);
let nodeCollection: any = null;

async function connectDB() {
    if (!nodeCollection) {
        try {
            await dbconnect.connect();
            const db = dbconnect.db("freedom-trail");
            nodeCollection = db.collection("badges");

        } catch (error) {
            console.error("Database connection error:", error);
            throw new Error("Database connection failed.");
        }
    }
}