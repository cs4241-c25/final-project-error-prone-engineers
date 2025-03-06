import {address, BusinessAccount, Node} from "@/types/BusinessAccount";
import {NextRequest, NextResponse} from "next/server";
import {connectDB} from "@/lib/database";
import {ObjectId} from "mongodb";
import {Client} from "@googlemaps/google-maps-services-js";

const geocoderClient = new Client({});

async function addressToLocation(address: string) {
    const res = await geocoderClient.geocode({params:
            {key: process.env.GOOGLE_GEOCODER_KEY ?? "", address: address}});
    const location = res.data.results[0].geometry.location
    return [location.lat, location.lng];
}

export async function POST(request: NextRequest) {
    try {
        const formData: BusinessAccount = await request.json();
        const location: number[] = await addressToLocation(address(formData.addressParts));

        const nodeToInsert = {
            name: formData.node?.name, type: formData.node?.type, description: formData.node?.description,
            address: address(formData.addressParts), coordinates: location,
            accessibility: formData.node?.accessibility, publicRestroom: formData.node?.publicRestroom
        };
        let nodesCollection = await connectDB("nodes");
        const nodeResult = await nodesCollection.insertOne(nodeToInsert);
        console.log(nodeResult);

        const businessToInsert = {
            email: formData.email, ownerName: formData.ownerName, phoneNumber: formData.phoneNumber,
            businessEmail: formData.businessEmail, node: nodeResult.insertedId, addressParts: formData.addressParts
        };
        let businessesCollection = await connectDB("businesses");
        const businessesResult = await businessesCollection.insertOne(businessToInsert);
        console.log(businessesResult);

        return NextResponse.json({ status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ status: 400 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const formData: BusinessAccount = await request.json();
        const location: number[] = await addressToLocation(address(formData.addressParts));

        let nodesCollection = await connectDB("nodes");
        const nodeResult = await nodesCollection.updateOne({_id: new ObjectId(formData.node!._id)},
            {$set: {name: formData.node?.name, type: formData.node?.type, description: formData.node?.description,
            address: address(formData.addressParts), coordinates: location,
            accessibility: formData.node?.accessibility, publicRestroom: formData.node?.publicRestroom}});
        console.log(nodeResult);

        let businessesCollection = await connectDB("businesses");
        const businessesResult = await businessesCollection.updateOne({_id: new ObjectId(formData._id)},
            {$set: {ownerName: formData.ownerName, phoneNumber: formData.phoneNumber,
                    businessEmail: formData.businessEmail, addressParts: formData.addressParts}});
        console.log(businessesResult);

        return NextResponse.json({ status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ status: 400 });
    }
}

export async function GET(request: NextRequest) {
    try {
        let businessesCollection = await connectDB("businesses");
        let nodesCollection = await connectDB("nodes");
        const email: string | null = request.nextUrl.searchParams.get("email");
        const _id: string | null = request.nextUrl.searchParams.get("_id");

        if (email) {
            const businesses = await businessesCollection.find({ email }).toArray();
            for (const business of businesses) {
                business.node = await nodesCollection.findOne({_id: new ObjectId(business.node)}) as unknown as Node;
            }
            return NextResponse.json({ status: 200, businesses: businesses.map(b => ({ ...b, _id: b._id.toString()}) as BusinessAccount) });
        }
        else if (_id) {
            const business = await businessesCollection.findOne({ _id: new ObjectId(_id) });
            if (business === null) {
                return NextResponse.json({ status: 400 });
            }
            business.node = await nodesCollection.findOne({_id: new ObjectId(business.node)}) as unknown as Node;
            return NextResponse.json({ status: 200, business: business ? { ...business, _id: business._id.toString() } as BusinessAccount : null });
        }
        else {
            const businesses = await businessesCollection.find({}).toArray();
            for (const business of businesses) {
                business.node = await nodesCollection.findOne({_id: new ObjectId(business.node)}) as unknown as Node;
            }
            return NextResponse.json({ status: 200, businesses: businesses.map(b => ({ ...b, _id: b._id.toString() }) as BusinessAccount) });
        }
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ status: 400 });
    }
}


export async function DELETE(request: NextRequest) {
    try {
        let businessesCollection = await connectDB("businesses");
        const _id: string = request.nextUrl.searchParams.get("_id")!;
        const business = await businessesCollection.findOne({_id: new ObjectId(_id)});
        const _node_id = new ObjectId(business!.node);
        const businessResult = await businessesCollection.deleteOne({_id: new ObjectId(_id)});
        console.log(businessResult);

        let nodesCollection = await connectDB("nodes");
        const nodeResult = await nodesCollection.deleteOne({_id: _node_id});
        console.log(nodeResult);

        return NextResponse.json({ status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ status: 400 });
    }
}
