module.exports = {
    apps: [
        {
            name: 'mygame',
            script: 'backend/server.js', // Adjust the path if necessary
            env: {
                NODE_ENV: 'development',
                PORT: 3001 // Set the desired port here
            }
        }
    ]
};
