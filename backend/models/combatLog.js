const mongoose = require('mongoose');

const combatLogSchema = new mongoose.Schema({
    player1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true,
    },
    player2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true,
    },
    result: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const CombatLog = mongoose.model('CombatLog', combatLogSchema);

module.exports = CombatLog;
