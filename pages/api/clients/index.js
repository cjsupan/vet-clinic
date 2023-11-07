import clientPromise from "../../../database/connection";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("vetclinic");

  const { method } = req;

  switch (method) {
    case "GET":
      const allClients = await db.collection("Clients").find({}).toArray();
      res.json(allClients);
      break;
    case "POST":
      let bodyObject = req.body;
      let Clients = await db.collection("Clients").insertOne(bodyObject);
      res.json(Clients);
      break;
  }
}
