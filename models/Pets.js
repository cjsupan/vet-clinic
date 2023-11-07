import {Schema, models, model} from 'mongoose';
import { boolean } from 'yup';

const PetSchema = new Schema({
    _id:{
        type: int
    },
    Name: {
        type: String,
        required: true,
        trim: true,
    },
    Species: {
        type: String,
        required: true,
        trim: true,
    },
    Breed: {
        type: String,
        required: true,
    },
    Sex: {
        type: String,
        required: true,
    },
    Altered: {
        type: String,
        required: true,
        trim: true,
    },
    Birthdate: {
        type: Date,
        required: true
    },
    Color: {
      type: boolean,
      required: true
    },
    ClientId:{
      type: int
    },
});

const Pet = models.Pets || model('Pets', PetSchema);

export default Pet;

