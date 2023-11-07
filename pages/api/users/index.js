import { all } from "axios";
import clientPromise from "../../../database/connection";

export default async function handler(req, res) {
  const user = await clientPromise;
  const db = user.db("vetclinic");

  const { method } = req;

  switch (method) {
    case "GET":
      const allUsers = await db.collection("Users").find({}).toArray();
      res.json(allUsers);
      break;
    case "POST":
      let bodyObject = req.body;
      let Users = await db.collection("Users").insertOne(bodyObject);
      res.json(Users);
      break;
  }
}
