import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { BusinessAccount } from "@/types/BusinessAccount";

const dbconnect = new MongoClient(process.env.MONGO_URI!);
let businessesCollection: any = null;

async function connectDB() {
    if (!businessesCollection) {
        await dbconnect.connect();
        const db = dbconnect.db("freedom-trail");
        businessesCollection = db.collection("businesses");
    }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        await connectDB();
        const formData: BusinessAccount = req.body;
        const result = await businessesCollection.insertOne(formData);
        console.log(result);
        return res.status(200)
    }
    catch (error) {
        console.log(error);
        return res.status(400);
    }

}
