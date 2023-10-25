const { setupApp } = require('./app');

const PORT = 8080;
const app = setupApp();

app.listen(PORT, () => {
    console.log(`🚀 Server started: http://localhost:${PORT}`);
});
