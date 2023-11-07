import clientPromise from "../../../database/connection";
const  ObjectID = require('mongodb').ObjectId;
export default async function handler(req, res){
  const pet = await clientPromise;
  const db = pet.db("vetclinic");
  const { method } = req;

  switch(method){
    case 'GET': 
      const allClientPets = await db.collection("Pets").find({}).toArray();
      res.json({ status: 200, data: allClientPets });
    break;
    case "POST":
      let bodyObject = JSON.parse(req.body);
      let Pets= await db.collection("Pets").insertOne(bodyObject);
      res.json(Pets);
    break;
  }
}
