# Mark-xMD 🚀
### A Simple, Modular WhatsApp Bot 

![Mark-xMD](https://img.shields.io/badge/Mark-xMD-v1.0.0-blue) ![NodeJS](https://img.shields.io/badge/Node.js-18+-green)

Mark-xMD is a lightweight WhatsApp Userbot built with Baileys. It supports Gifted Sessions and cloud deployment.

## 🌟 Features
- [x] Antilink (Auto-Kick)
- [x] Modular Plugin System
- [x] Menu & Ping
- [x] Cloud Ready (Heroku, Render, Replit)

## 🛠️ Setup & Session

### 1. Get Session ID
You need a "Gifted" style Session ID (Base64 of creds.json).
1. Run the bot locally on your PC first (`npm start`).
2. Scan the QR.
3. The `auth_info/creds.json` file will be created.
4. Convert the content of `creds.json` to Base64 (use a site like base64encode.org).
5. That string is your `SESSION_ID`.

---

## 🚀 Deployment

### Method 1: Heroku
1. Fork this repository.
2. Create a specific app on Heroku.
3. Go to Settings -> Reveal Config Vars.
4. Add the following Variables:
   - `SESSION_ID`: (Your Long Base64 Code)
   - `BOT_NAME`: Mark-xMD
   - `OWNER_NUMBER`: 254700000000
   - `ANTILINK`: true
5. Deploy the branch.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

### Method 2: Render
1. Create a Web Service.
2. Select your repository.
3. Runtime: **Node**. Build Command: `npm install`. Start Command: `npm start`.
4. Add Environment Variables in settings.

### Method 3: Replit
1. Import repo to Replit.
2. Add your secrets in the "Secrets" tool (SESSION_ID, etc).
3. Click Run. 

---

## 📂 Plugins Structure
- **Menu**: `.menu`
- **Ping**: `.ping`
- **Antilink**: `.antilink on` / `.antilink off`

## © Credits
Created by **Mark** | Based on Baileys Library
