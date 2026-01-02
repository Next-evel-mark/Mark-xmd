const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

function keepAlive() {
    app.get('/', (req, res) => {
        res.send('Mark-xMD is Running! 🚀');
    });

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

module.exports = keepAlive;
