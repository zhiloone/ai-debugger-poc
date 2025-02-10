import { MongoClient } from "mongodb";

const URI = process.env.MONGODB_URI; // Define this in .env.local
const options = {};

if (!URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Use global variable to preserve connection in development (avoids hot reload issues)
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(URI, options);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  // In production, create a new connection
  client = new MongoClient(URI, options);
  clientPromise = client.connect();
}

export default clientPromise;