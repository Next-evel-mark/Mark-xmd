const config = require('../config');

module.exports = {
    cmd: 'antilink',
    desc: 'Toggle Antilink',
    run: async (sock, msg, args) => {
        if (!msg.key.remoteJid.endsWith('@g.us')) return;
        
        // Simple toggle logic (In a real DB bot, you would save this to database)
        if (args[0] === 'on') {
            config.antilink = true;
            await sock.sendMessage(msg.key.remoteJid, { text: 'Antilink Enabled ✅' });
        } else if (args[0] === 'off') {
            config.antilink = false;
            await sock.sendMessage(msg.key.remoteJid, { text: 'Antilink Disabled ❌' });
        } else {
            await sock.sendMessage(msg.key.remoteJid, { text: 'Use: .antilink on / off' });
        }
    }
};
