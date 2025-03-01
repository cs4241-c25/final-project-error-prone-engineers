import { MongoClient, Db } from "mongodb";

const MONGO_URI = process.env.MONGO_URI as string;
const DB_NAME = "freedom-trail";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
let cachedPromise: Promise<Db> | null = null;

export async function connectDB(collectionName: string) {
    if (cachedDb) {
        return cachedDb.collection(collectionName);
    }

    if (!cachedPromise) {
        cachedPromise = (async () => {
            const client = new MongoClient(MONGO_URI);
            await client.connect();
            cachedClient = client;
            // console.log("Connected to MongoDB");
            cachedDb = client.db(DB_NAME);
            return cachedDb;
        })();
    }

    cachedDb = await cachedPromise;
    return cachedDb.collection(collectionName);
}

async function closeDB() {
    if (cachedClient) {
        await cachedClient.close();
        cachedClient = null;
        cachedDb = null;
        cachedPromise = null;
    }
}

if (process.env.NODE_ENV !== "production") {
    process.on("SIGINT", async () => {
        await closeDB();
        process.exit(0);
    });

    process.on("SIGTERM", async () => {
        await closeDB();
        process.exit(0);
    });
}
