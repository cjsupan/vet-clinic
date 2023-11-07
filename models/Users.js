import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  Email: {
    type: String,
    required: true,
    trim: true,
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
  Password: {
    type: String,
    required: true,
  },
  Contact: {
    type: String,
    required: true,
  },
  Active: {
    type: String,
    required: true,
  },
});

const User = models.Users || model("Users", UserSchema);

export default User;
