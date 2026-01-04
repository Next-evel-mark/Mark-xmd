const config = require('../config');

module.exports = {
    cmd: 'menu',
    desc: 'Shows command list',
    run: async (sock, msg, args) => {
        let text = `🤖 *${config.botName} MENU* 🤖\n\n`;
        text += `👑 Owner: ${config.ownerNumber}\n`;
        text += `🧩 Prefix: ${config.prefix}\n\n`;
        
        global.commands.forEach((plugin, name) => {
            text += `🔹 *${config.prefix}${name}*\n`;
        });

        await sock.sendMessage(msg.key.remoteJid, { text: text }, { quoted: msg });
    }
};
