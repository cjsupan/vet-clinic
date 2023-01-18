import {Schema, models, model} from 'mongoose';

const ClientSchema = new Schema({
    _id:{
        type: int
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
    }
});

const Clients = models.Clients || model('Clients', ClientSchema);

export default Clients;

