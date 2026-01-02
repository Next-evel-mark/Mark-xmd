require('../config');
module.exports = {
    handler: async (sock, msg) => {
        const type = Object.keys(msg.message)[0];
        const body = (type === 'conversation') ? msg.message.conversation :
                     (type === 'extendedTextMessage') ? msg.message.extendedTextMessage.text : 
                     (type === 'imageMessage') ? msg.message.imageMessage.caption : '';

        const isGroup = msg.key.remoteJid.endsWith('@g.us');
        const sender = isGroup ? msg.key.participant : msg.key.remoteJid;
        
        // IGNORE BOT MESSAGES
        if (msg.key.fromMe) return;

        // PRIVATE MODE LOGIC
        if (global.mode === 'private' && !global.owner.includes(sender.split('@')[0])) return;

        // ANTILINK
        if (isGroup && global.antilink && body.includes('chat.whatsapp.com')) {
            const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
            const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            const isBotAdmin = groupMetadata.participants.find(p => p.id === botNumber)?.admin;
            const isSenderAdmin = groupMetadata.participants.find(p => p.id === sender)?.admin;

            if (isBotAdmin && !isSenderAdmin) {
                await sock.sendMessage(msg.key.remoteJid, { delete: msg.key });
                await sock.groupParticipantsUpdate(msg.key.remoteJid, [sender], 'remove');
            }
        }

        // COMMANDS
        if (body.startsWith(global.prefix)) {
            const cmd = body.slice(global.prefix.length).trim().split(' ')[0].toLowerCase();
            const args = body.trim().split(/ +/).slice(1);
            const command = global.commands.get(cmd);

            if (command) {
                await command.run(sock, msg, args);
            }
        }
    }
};
