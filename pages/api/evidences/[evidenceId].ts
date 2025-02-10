import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongo";

type Evidence = {
  _id: string;
};

type DetectorFinishedEntry = {
  _id: string;
}

type PriceFinishedEntry = {
  _id: string;
}

type ClassifierFinishedEntry = {
  _id: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_NAME);
    const evidenceCollection = db.collection<Evidence>("upload_finished");

    if (req.method === "GET") {
      const { evidenceId } = req.query
      if (!evidenceId) return res.status(400).json({ error: "Missing evidenceId" });

      const evidence = await evidenceCollection.findOne({ _id: evidenceId });
      if (!evidence) {
        return res.status(404).json({ error: "Evidence not found" });
      }

      const detectorFinishedCollection = db.collection<DetectorFinishedEntry>("detector_finished")
      const priceFinishedCollection = db.collection<PriceFinishedEntry>("price_finished")
      const classifierFinishedCollection = db.collection<ClassifierFinishedEntry>("classifier_finished")

      const detectorResult = await detectorFinishedCollection.findOne({ _id: evidenceId })
      const priceResult = await priceFinishedCollection.findOne({ _id: evidenceId })
      const classifierResult = await classifierFinishedCollection.findOne({ _id: evidenceId })

      res.status(200).json({
        imageUrl: evidenceId,
        detectorResult,
        priceResult,
        classifierResult
      });
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}