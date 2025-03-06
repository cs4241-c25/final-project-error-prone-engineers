import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database";


export async function GET(req: Request) {
    try {
        let nodeCollection = await connectDB("nodes");

        const { searchParams } = new URL(req.url);
        const nodeName = searchParams.get("name");

        let nodeInformation = null;

        if (!nodeName) {
            nodeInformation = await nodeCollection.find({}).toArray();
            // return NextResponse.json({ error: "Missing 'name' parameter" }, { status: 400 } as NextResponse);
        }
        else {
            nodeInformation = await nodeCollection.findOne({ name: nodeName });
            if (!nodeInformation) {
                return NextResponse.json({ error: "Node not found" }, { status: 404 } as NextResponse);
            }
        }
        console.log(nodeInformation)
        // console.log("Fetched Node:", nodeInformation);
        return NextResponse.json(nodeInformation);

        
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 } as NextResponse);
    }
}