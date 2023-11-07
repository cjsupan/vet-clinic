import clientPromise from "../../../database/connection";
const ObjectID = require("mongodb").ObjectId;
export default async function handler(req, res) {
  const appointment = await clientPromise;
  const db = appointment.db("vetclinic");

  const { method } = req;
  const { id } = req.query;
  const values = req.body;

  switch (method) {
    case "GET":
      const appointment = await db
        .collection("Appointments")
        .find({ _id: ObjectID(id) })
        .toArray();
      res.json({ status: 200, data: appointment });
      break;
    case "PATCH":
      const updatedAppointment = await db
        .collection("Appointments")
        .update({ _id: ObjectID(id) }, { $set: values });
      res.json({ status: 200, data: updatedAppointment });
      break;
    case "DELETE":
      const deleteAppointment = await db
        .collection("Appointments")
        .deleteOne({ _id: ObjectID(id) });
      res.json({ status: 200, data: deleteAppointment });
      break;
  }
}
