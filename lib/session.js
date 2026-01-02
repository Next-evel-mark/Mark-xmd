const fs = require('fs');
const path = require('path');

async function makeSession(sessionID) {
    const credsPath = path.join(__dirname, '../auth_info/creds.json');
    const authDir = path.join(__dirname, '../auth_info');

    if (!sessionID) {
        console.log("No Session ID found. Waiting for QR Scan...");
        return;
    }

    // Create auth folder if not exists
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    try {
        // Remove prefixes like "Gifted~" if present to get clean Base64
        const cleanSession = sessionID.replace(/^Gifted~|^Session~/, '');
        
        // Decode Base64 to JSON
        const decoded = Buffer.from(cleanSession, 'base64').toString('utf-8');
        
        // Write to creds.json
        fs.writeFileSync(credsPath, decoded);
        console.log("✅ Session restored from ID successfully!");
    } catch (err) {
        console.log("❌ Error restoring session. Please check your Session ID.");
        console.error(err);
    }
}

module.exports = makeSession;
