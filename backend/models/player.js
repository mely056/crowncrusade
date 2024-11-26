const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    energy: {
        type: Number,
        default: 100
    },
    trainingLevel: {
        type: Number,
        default: 0
    },
    weapon: {
        type: String,
        default: "Fists"
    }
});

module.exports = mongoose.model('Player', playerSchema);
