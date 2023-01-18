const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        required: [true, 'please enter your user name'],
        trim: true,
    },
    Firstname: {
        type: String,
        required: [true, 'please enter your first name'],
        trim: true,
    },
    Lastname: {
        type: String,
        required: [true, 'please enter your last name'],
        trim: true,
    }
});

module.exports = mongoose.model.Users || mongoose.model('Users', UserSchema);