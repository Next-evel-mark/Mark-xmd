const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const { boom } = require('@hapi/boom');
const config = require('./config');
const startSession = require('./lib/session');
const keepAlive = require('./keepalive');

// Start Web Server (For Replit/Render)
keepAlive();

// Load Plugins
global.commands = new Map();
const pluginFolder = path.join(__dirname, 'plugins');

const loadPlugins = () => {
    fs.readdirSync(pluginFolder).forEach(file => {
        if (file.endsWith('.js')) {
            const plugin = require(path.join(pluginFolder, file));
            if (plugin.cmd) {
                global.commands.set(plugin.cmd, plugin);
                console.log(`Loaded Plugin: ${plugin.cmd}`);
            }
        }
    });
};

async function startBot() {
    // 1. Process the Session ID
    await startSession();

    // 2. Load Auth State
    const { state, saveCreds } = await useMultiFileAuthState('./auth_info');
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true, // Shows QR if no session is found
        auth: state,
        browser: ["Mark-xMD", "Chrome", "1.0.0"]
    });

    loadPlugins();

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed. Reconnecting:', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('✅ Mark-xMD is Online!');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    // MESSAGE HANDLER
    sock.ev.on('messages.upsert', async (m) => {
        try {
            const msg = m.messages[0];
            if (!msg.message || msg.key.fromMe) return;

            const type = Object.keys(msg.message)[0];
            const body = (type === 'conversation') ? msg.message.conversation :
                         (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : 
                         (type === 'imageMessage') ? msg.message.imageMessage.caption : '';

            const sender = msg.key.remoteJid;
            const isGroup = sender.endsWith('@g.us');
            
            // ANTILINK CHECK
            if (isGroup && config.antilink && body.includes('chat.whatsapp.com')) {
                // Check if bot is admin
                const groupMetadata = await sock.groupMetadata(sender);
                const botId = sock.user.id.split(':')[0] + "@s.whatsapp.net";
                const isBotAdmin = groupMetadata.participants.find(p => p.id === botId)?.admin;
                
                if (isBotAdmin) {
                    await sock.sendMessage(sender, { delete: msg.key });
                    await sock.sendMessage(sender, { text: '🚫 Link Detected.' });
                }
            }

            // COMMAND HANDLER
            if (body.startsWith(config.prefix)) {
                const commandName = body.slice(config.prefix.length).trim().split(' ')[0].toLowerCase();
                const args = body.trim().split(/ +/).slice(1);
                
                const command = global.commands.get(commandName);
                if (command) {
                    await command.run(sock, msg, args);
                }
            }

        } catch (err) {
            console.log("Error handling message:", err);
        }
    });
}

startBot();
