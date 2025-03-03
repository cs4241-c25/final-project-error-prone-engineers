import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const dbconnect = new MongoClient(process.env.MONGO_URI!);
let nodeCollection: any = null;

async function connectDB() {
    if (!nodeCollection) {
        try {
            await dbconnect.connect();
            const db = dbconnect.db("freedom-trail");
            nodeCollection = db.collection("nodes");


        } catch (error) {
            console.error("Database connection error:", error);
            throw new Error("Database connection failed.");
        }
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const nodeName = searchParams.get("name");

        if (!nodeName) {
            return NextResponse.json({ error: "Missing 'name' parameter" }, { status: 400 } as NextResponse);
        }

        const nodeInformation = await nodeCollection.findOne({ name: nodeName });

        if (!nodeInformation) {
            return NextResponse.json({ error: "Node not found" }, { status: 404 } as NextResponse);
        }

        console.log("Fetched Node:", nodeInformation);

        return NextResponse.json(nodeInformation);
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 } as NextResponse);
    }
}