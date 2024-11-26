const socket = io();

const form = document.getElementById('chat-form');
const input = document.getElementById('message');
const messages = document.getElementById('messages');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

const createPlayer = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/players', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Player Name',
                energy: 100,
                trainingLevel: 0,
                weapon: 'Fists',
            }),
        });

        if (!response.ok) {
            throw new Error('Bad Request');
        }

        const player = await response.json();
        console.log('Player created:', player);

        document.getElementById('player-info').innerText = 
            `Name: ${player.name}, Energy: ${player.energy}, Training Level: ${player.trainingLevel}, Weapon: ${player.weapon}`;
    } catch (error) {
        console.error('Failed to create player', error.message);
    }
};

const getPlayer = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/players');
        const players = await response.json();

        if (players.length > 0) {
            const player = players[0];
            document.getElementById('player-info').innerText = 
                `Name: ${player.name}, Energy: ${player.energy}, Training Level: ${player.trainingLevel}, Weapon: ${player.weapon}`;
        } else {
            document.getElementById('player-info').innerText = 'No players found.';
        }
    } catch (error) {
        console.error('Failed to retrieve player', error);
    }
};

// Call getPlayer to fetch and display player data
getPlayer();

// Guild functionality
const guildForm = document.getElementById('guild-form');
const guildNameInput = document.getElementById('guild-name');
const guildList = document.getElementById('guild-list');

guildForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const guildName = guildNameInput.value;
    if (guildName) {
        try {
            const response = await fetch('http://localhost:3001/api/guilds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: guildName }),
            });

            if (!response.ok) {
                throw new Error('Failed to create guild');
            }

            const guild = await response.json();
            const item = document.createElement('li');
            item.textContent = guild.name;
            guildList.appendChild(item);
            guildNameInput.value = '';
        } catch (error) {
            console.error('Failed to create guild', error.message);
        }
    }
});

const getGuilds = async () => {
    try {
        const response = await fetch('http://localhost:3001/api/guilds');
        const guilds = await response.json();
        guildList.innerHTML = '';
        guilds.forEach(guild => {
            const item = document.createElement('li');
            item.textContent = guild.name;
            guildList.appendChild(item);
        });
    } catch (error) {
        console.error('Failed to retrieve guilds', error.message);
    }
};

// Call getGuilds to retrieve and display existing guilds
getGuilds();

// Training functionality
const trainingForm = document.getElementById('training-form');
const trainingMethodSelect = document.getElementById('training-method');

trainingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const method = trainingMethodSelect.value;
    const playerId = 'YOUR_PLAYER_ID';  // Replace with actual player ID

    try {
        const response = await fetch('http://localhost:3001/api/train', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ playerId, method }),
        });

        if (!response.ok) {
            throw new Error('Failed to train player');
        }

        const player = await response.json();
        console.log('Player trained:', player);

        document.getElementById('player-info').innerText = 
            `Name: ${player.name}, Energy: ${player.energy}, Training Level: ${player.trainingLevel}, Weapon: ${player.weapon}`;
    } catch (error) {
        console.error('Failed to train player', error.message);
    }
});
