# Mark-xMD 🚀
**An Advanced, Modular WhatsApp Userbot**

## ⚡ How to Deploy

### 1. Get a Session ID
Use any "Gifted" or Baileys Session Generator. 
The Session ID is a long text string.

### 2. Deploy on Heroku / Render / Replit

**Environment Variables Required:**
- `SESSION_ID`: Paste your session ID here.
- `OWNER_NUMBER`: Your WhatsApp number (e.g., 2547xxx).
- `PREFIX`: Your bot prefix (e.g., .).
- `ANTILINK`: true/false.

### 3. Add Plugins
To add a new command, just create a new `.js` file in the `plugins/` folder using this format:

```javascript
module.exports = {
    cmd: 'mycommand',
    run: async (sock, msg, args) => {
        await sock.sendMessage(msg.key.remoteJid, { text: 'Hello!' });
    }
};
