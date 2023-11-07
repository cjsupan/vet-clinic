import clientPromise from "../../../database/connection";
const ObjectID = require("mongodb").ObjectId;
export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("vetclinic");

  const { method } = req;
  const { id } = req.query;
  const values = req.body;

  switch (method) {
    case "GET":
      const client = await db
        .collection("Clients")
        .find({ _id: ObjectID(id) })
        .toArray();
      res.json({ status: 200, data: client });
      break;
    case "PATCH":
      const updatedClient = await db
        .collection("Clients")
        .update({ _id: ObjectID(id) }, { $set: values });
      res.json({ status: 200, data: updatedClient });
      break;
    case "DELETE":
      const deleteResult = await db
        .collection("Clients")
        .deleteOne({ _id: ObjectID(id) });
      res.json({ status: 200, data: deleteResult });
      break;
  }
}
