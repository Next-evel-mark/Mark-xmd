const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

function keepAlive() {
    app.get('/', (req, res) => res.send('Mark-xMD is Alive!'));
    app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = keepAlive;
