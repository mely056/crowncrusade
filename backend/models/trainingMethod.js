const mongoose = require('mongoose');

const trainingMethodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    attribute: {
        type: String,
        required: true,
    },
    energyCost: {
        type: Number,
        required: true,
    },
});

const TrainingMethod = mongoose.model('TrainingMethod', trainingMethodSchema);

module.exports = TrainingMethod;
