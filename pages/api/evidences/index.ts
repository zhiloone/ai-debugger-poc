import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongo";

type Evidence = {
  _id: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const collection = db.collection<Evidence>("upload_finished");

    if (req.method === "GET") {
      const products = await collection.find({}).toArray();
      res.status(200).json(products);
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}