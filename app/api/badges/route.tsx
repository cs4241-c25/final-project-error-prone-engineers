import {NextResponse} from "next/server";
import {connectDB} from "@/lib/database";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";


export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let badgesCollection = await connectDB("badges");
        const badges = await badgesCollection.find({ email: session.user?.email || "" }).toArray();

        return NextResponse.json({status: 200, badges: badges});
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ status: 400 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { badgeName, locationName, description} = await req.json();
    const email = session.user?.email || "";
    const creationDate = new Date();

    let badgesCollection = await connectDB("badges");

    const newBadge = {
        email,
        badgeName,
        locationName,
        description,
        creation_date: creationDate,
    };

    const existingBadge = await badgesCollection.findOne({
        email: newBadge.email,
        badgeName: newBadge.badgeName
    });

    if (existingBadge) {
        return NextResponse.json({ status: 400, message: "Badge already exists for user!" });
    }

    const result = await badgesCollection.insertOne(newBadge);
    return NextResponse.json({ message: "Badge added successfully!", insertedId: result.insertedId });
}