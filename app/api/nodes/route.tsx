import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const dbconnect = new MongoClient(process.env.MONGO_URI!);
let nodeCollection: any = null;

async function connectDB() {
    if (!nodeCollection) {
        await dbconnect.connect();
        const db = dbconnect.db("freedom-trail");
        nodeCollection = db.collection("nodes");
    }
}

export async function GET(req: Request) {
    await connectDB();
    const nodeName = req.headers.get("name");

    if (!nodeName) {
        return NextResponse.json({ error: "Missing 'name' header" }, { status: 400 });
    }

    const nodeInformation = await nodeCollection.find({ name: nodeName }).toArray();
    console.log(nodeInformation);
    return NextResponse.json(nodeInformation);
}
