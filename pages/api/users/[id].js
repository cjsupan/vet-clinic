import clientPromise from "../../../database/connection";
const ObjectID = require("mongodb").ObjectId;
export default async function handler(req, res) {
  const user = await clientPromise;
  const db = user.db("vetclinic");

  const { method } = req;
  const { id } = req.query;
  const values = req.body;

  switch (method) {
    case "GET":
      const client = await db
        .collection("Users")
        .find({ _id: ObjectID(id) })
        .toArray();
      res.json({ status: 200, data: client });
      break;
    case "PATCH":
      const updateUsers = await db
        .collection("Users")
        .update({ _id: ObjectID(id) }, { $set: values });
      res.json({ status: 200, data: updateUsers });
      break;
    case "DELETE":
      const deleteResult = await db
        .collection("Users")
        .deleteOne({ _id: ObjectID(id) });
      res.json({ status: 200, data: deleteResult });
      break;
  }
}
