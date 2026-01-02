const fs = require('fs');
const chalk = require('chalk');

// READ ENV VARIABLES (For Heroku/Render/Replit)
module.exports = {
    sessionID: process.env.SESSION_ID || '', // Put your Session ID here if running locally
    botName: process.env.BOT_NAME || 'Mark-xMD',
    owner: [process.env.OWNER_NUMBER || '254700000000'], // Your number
    packname: process.env.PACKNAME || 'Mark-xMD',
    author: process.env.AUTHOR || 'Mark Tech',
    prefix: process.env.PREFIX || '.',
    antilink: process.env.ANTILINK === 'true', // Default to false unless set to true
    mode: process.env.MODE || 'public', // public or private
};

// Watch for file changes
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[file];
    require(file);
});
