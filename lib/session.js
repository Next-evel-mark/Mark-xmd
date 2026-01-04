const fs = require('fs-extra');
const path = require('path');
const { sessionID } = require('../config');

async function startSession() {
    const authFolder = path.join(__dirname, '../auth_info');
    const credsFile = path.join(authFolder, 'creds.json');

    // If auth folder doesn't exist, create it
    if (!fs.existsSync(authFolder)) {
        fs.mkdirSync(authFolder, { recursive: true });
    }

    // If we have a Session ID but no creds.json, decode it
    if (sessionID && !fs.existsSync(credsFile)) {
        console.log("Found Session ID. Decoding...");
        
        try {
            // Remove 'Gifted~' prefix if present
            const cleanSession = sessionID.replace(/^Gifted~/, '');
            
            // Decode Base64
            const decodedBuffer = Buffer.from(cleanSession, 'base64');
            const credsData = decodedBuffer.toString('utf-8');

            // Save to creds.json
            fs.writeFileSync(credsFile, credsData);
            console.log("✅ Session Loaded Successfully!");
        } catch (error) {
            console.error("❌ Failed to decode Session ID. Make sure it is valid.", error);
        }
    }
}

module.exports = startSession;
