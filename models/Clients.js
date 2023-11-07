import { Schema, models, model } from "mongoose";
import { boolean } from "yup";

const ClientSchema = new Schema({
  _id: {
    type: int,
  },
  Firstname: {
    type: String,
    required: true,
    trim: true,
  },
  Lastname: {
    type: String,
    required: true,
    trim: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Contact: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
    trim: true,
  },
  Active: {
    type: boolean,
    required: true,
  },
});

const Clients = models.Clients || model("Clients", ClientSchema);

export default Clients;
