const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
    }],
});

const Guild = mongoose.model('Guild', guildSchema);

module.exports = Guild;
