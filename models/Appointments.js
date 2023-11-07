import { Schema, models, model } from "mongoose";
import { boolean } from "yup";

const AppointmentSchema = new Schema({
  _id: {
    type: int,
  },
  ClientID: {
    type: int,
    required: true,
  },
  AppointmentData: {
    type: String,
    required: true,
  },
  AppointmentTime: {
    type: String,
    required: true,
  },
  Active: {
    type: boolean,
    required: true,
  },
});

const Appointments =
  models.Appointments || model("Appointments", AppointmentSchema);

export default Appointments;
