const fs = require('fs');
const chalk = require('chalk');

module.exports = {
    // PASTE YOUR SESSION ID HERE IF RUNNING LOCALLY
    sessionID: process.env.SESSION_ID || "", 
    
    botName: "Mark-xMD",
    ownerNumber: [process.env.OWNER_NUMBER || "254700000000"], // Your number
    prefix: process.env.PREFIX || ".",
    
    // Antilink Default State
    antilink: process.env.ANTILINK === 'true',
};
