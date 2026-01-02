require('./config');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const { handler } = require('./lib/handler');
const makeSession = require('./lib/session');
const keepAlive = require('./keepalive');

// START WEBSERVER
keepAlive();

// LOAD PLUGINS
global.commands = new Map();
const pluginFolder = path.join(__dirname, 'plugins');

if (fs.existsSync(pluginFolder)) {
    fs.readdirSync(pluginFolder).forEach(file => {
        if (file.endsWith('.js')) {
            const plugin = require(path.join(pluginFolder, file));
            if (plugin.cmd) global.commands.set(plugin.cmd, plugin);
        }
    });
}

async function startBot() {
    // RESTORE SESSION IF EXISTS
    if (!fs.existsSync('./auth_info/creds.json')) {
        await makeSession(global.sessionID);
    }

    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        browser: ["Mark-xMD", "Safari", "1.0.0"]
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            if (shouldReconnect) {
                console.log("Reconnecting...");
                startBot();
            } else {
                console.log("Session Invalidated. Please rescan or update Session ID.");
            }
        } else if (connection === 'open') {
            console.log('✅ Mark-xMD Connected Successfully!');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (chatUpdate) => {
        try {
            const msg = chatUpdate.messages[0];
            if (!msg.message) return;
            await handler(sock, msg);
        } catch (err) {
            console.log(err);
        }
    });
}

startBot();
