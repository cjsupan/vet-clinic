
import clientPromise from "../../../../database/connection";
const  ObjectID = require('mongodb').ObjectId;
export default async function handler(req, res){
  const pet = await clientPromise;
  const db = pet.db("vetclinic");
  const { method } = req;
  const { id } = req.query;
  const { Status } = req.body;
  
  switch(method){
    case 'GET': 
    const pet = await db.collection("Pets").find({ClientId: ObjectID(id)}).project({Name: 1, Species: 1, Breed: 1, Sex: 1, Altered: 1, Birthdate: 1, Color: 1}).toArray();
    res.json({ status: 200, data: pet });
    break;
    case 'PATCH': 
    const updatePet = await db.collection("Pets").updateOne({_id: ObjectID(id)},{$set: {Status: Status}} );
    res.json({ status: 200, data: updatePet });
    break;
  }
}
