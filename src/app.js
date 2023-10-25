const express = require('express');
const cors = require('cors');
const { routes } = require('./routes');

function setupApp() {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(routes);
    return app;
}

module.exports = { setupApp };
