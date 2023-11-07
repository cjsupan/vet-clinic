
import clientPromise from "../../../database/connection";
const  ObjectID = require('mongodb').ObjectId;
export default async function handler(req, res){
  const pet = await clientPromise;
  const db = pet.db("vetclinic");
  const { method } = req;
  const { id } = req.query;
  const { Status } = req.body;
  
  switch(method){
    case 'GET': 
    const pet = await db.collection("Pets").find({_id: ObjectID(id)}).toArray();
    res.json({ status: 200, data: pet });
    break;
    case 'PATCH': 
    const updatePet = await db.collection("Pets").updateOne({_id: ObjectID(id)},{$set: {Status: Status}} );
    res.json({ status: 200, data: updatePet });
    break;
  }
}
