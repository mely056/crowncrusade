const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Line 4

const Player = require('./models/player');
const Guild = require('./models/guild');
const TrainingMethod = require('./models/trainingMethod');
const CombatLog = require('./models/combatLog');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(cors());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public'))); // Line 21

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/medievalTorn', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB", err);
});

// Initialize training methods
const trainingMethods = [
    { name: 'Combat Arena', attribute: 'strength', energyCost: 10 },
    { name: 'Mystic Forest', attribute: 'intelligence', energyCost: 10 },
    { name: 'Mountain Climb', attribute: 'endurance', energyCost: 10 },
    { name: 'Ancient Library', attribute: 'agility', energyCost: 10 },
];

trainingMethods.forEach(async (method) => {
    const existingMethod = await TrainingMethod.findOne({ name: method.name });
    if (!existingMethod) {
        const newMethod = new TrainingMethod(method);
        await newMethod.save();
    }
});

// Socket.io setup for chat functionality
io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

// Character creation route
app.post('/api/players', async (req, res) => {
    try {
        const player = new Player(req.body);
        await player.save();
        res.status(201).send(player);
    } catch (e) {
        console.error('Error creating player:', e);
        res.status(400).send({ error: e.message });
    }
});

// Retrieve all players route
app.get('/api/players', async (req, res) => {
    try {
        const players = await Player.find({});
        res.status(200).send(players);
    } catch (e) {
        console.error('Error retrieving players:', e);
        res.status(500).send({ error: e.message });
    }
});

// Training route
app.post('/api/train', async (req, res) => {
    const { playerId, method } = req.body;

    try {
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).send({ error: 'Player not found' });
        }

        const training = await TrainingMethod.findOne({ name: method });
        if (!training) {
            return res.status(400).send({ error: 'Invalid training method' });
        }

        if (player.energy < training.energyCost) {
            return res.status(400).send({ error: 'Not enough energy' });
        }

        player.energy -= training.energyCost;
        player[training.attribute] += 1;
        await player.save();

        res.status(200).send(player);
    } catch (e) {
        console.error('Error during training:', e);
        res.status(400).send({ error: e.message });
    }
});

// Guild routes
app.post('/api/guilds', async (req, res) => {
    try {
        const guild = new Guild(req.body);
        await guild.save();
        res.status(201).send(guild);
    } catch (e) {
        console.error('Error creating guild:', e);
        res.status(400).send({ error: e.message });
    }
});

app.get('/api/guilds', async (req, res) => {
    try {
        const guilds = await Guild.find({});
        res.status(200).send(guilds);
    } catch (e) {
        console.error('Error retrieving guilds:', e);
        res.status(500).send({ error: e.message });
    }
});

app.post('/api/guilds/:guildId/members', async (req, res) => {
    try {
        const guild = await Guild.findById(req.params.guildId);
        if (!guild) {
            return res.status(404).send({ error: 'Guild not found' });
        }
        guild.members.push(req.body.memberId);
        await guild.save();
        res.status(200).send(guild);
    } catch (e) {
        console.error('Error adding member to guild:', e);
        res.status(400).send({ error: e.message });
    }
});

// Combat route
app.post('/api/combat', async (req, res) => {
    const { player1Id, player2Id } = req.body;

    try {
        const player1 = await Player.findById(player1Id);
        const player2 = await Player.findById(player2Id);

        if (!player1 || !player2) {
            return res.status(404).send({ error: 'Player not found' });
        }

        // Simplified combat logic for example purposes
        const player1Strength = player1.strength + Math.random() * player1.agility;
        const player2Strength = player2.strength + Math.random() * player2.agility;

        const result = player1Strength > player2Strength ? 'Player 1 wins!' : 'Player 2 wins!';

        // Save combat log
        const combatLog = new CombatLog({
            player1: player1._id,
            player2: player2._id,
            result,
        });
        await combatLog.save();

        res.status(200).send({ result });
    } catch (e) {
        console.error('Error during combat:', e);
        res.status(400).send({ error: e.message });
    }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
