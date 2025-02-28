import { MongoClient, Db, Collection } from "mongodb";

const MONGO_URI = process.env.MONGO_URI as string;
const DB_NAME = "freedom-trail";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;


export async function connectDB(collectionName: string){
    if (!cachedClient || !cachedDb) {
        cachedClient = new MongoClient(MONGO_URI);
        await cachedClient.connect();
        cachedDb = cachedClient.db(DB_NAME);
    }

    return cachedDb.collection(collectionName);
}

async function closeDB() {
    if (cachedClient) {
        await cachedClient.close();
        cachedClient = null;
        cachedDb = null;
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
