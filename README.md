# Discord Bot

Discord bot with a levels/XP system and YouTube music playback.

## Features

- **Levels / XP**: silent XP gain per message (15–25 XP, 1 min cooldown), `/stats`, `/leaderboard`.
  The bot never sends automatic messages: stats are only available through `/stats`.
- **YouTube music**: `/play`, `/skip`, `/pause`, `/resume`, `/queue`, `/nowplaying`, `/volume`, `/stop`
- **Utilities**: `/ping`, `/help`

## Setup

### 1. Create the Discord application

1. Go to https://discord.com/developers/applications → **New Application**
2. **Bot** tab:
   - **Reset Token** → copy the token (it is only shown once)
   - Enable **Message Content Intent** (required for the XP system)
3. **General Information** tab: copy the **Application ID**

### 2. Configure the project

```bash
npm install
```

Copy `.env.example` to `.env` and fill it in:

```env
DISCORD_TOKEN=your_token
CLIENT_ID=your_application_id
GUILD_ID=your_test_server_id   # optional, for instant slash command deployment
```

### 3. Invite the bot to your server

Replace `YOUR_CLIENT_ID` in this link and open it:

```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot+applications.commands&permissions=3197952
```

(Permissions: read/send messages, embed links, connect and speak in voice channels.)

### 4. Deploy the slash commands, then start

```bash
npm run deploy   # registers the slash commands (run again whenever you add/change a command)
npm start        # starts the bot
```

## Structure

```
src/
├── index.js            # entry point (client, music player)
├── deploy-commands.js  # slash command registration
├── database.js         # SQLite (better-sqlite3), XP storage
├── xp.js               # XP gain and leveling logic
├── events/             # ready, interactionCreate, messageCreate (XP)
└── commands/
    ├── levels/         # stats, leaderboard
    ├── music/          # play, skip, stop, pause, resume, queue, nowplaying, volume
    └── utils/          # ping, help
```

## Notes

- The database is created automatically at `data/bot.sqlite`.
- YouTube playback relies on `discord-player-youtubei`; if YouTube changes its protections,
  update with `npm update discord-player discord-player-youtubei`.
