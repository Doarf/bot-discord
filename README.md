# bot-discord

<div align="center">

**Discord bot with XP leveling and YouTube music playback**
*discord.js · discord-player · SQLite · yt-dlp · Node.js*

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![discord.js](https://img.shields.io/badge/discord.js-14.x-5865F2?logo=discord&logoColor=white)
![discord-player](https://img.shields.io/badge/discord--player-7.x-EB459E)
![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?logo=sqlite&logoColor=white)
![yt-dlp](https://img.shields.io/badge/yt--dlp-audio%20streaming-FF0000?logo=youtube&logoColor=white)
![FFmpeg](https://img.shields.io/badge/FFmpeg-static-007808?logo=ffmpeg&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green)

</div>

---

## About the project

**bot-discord** is a self-hosted Discord bot combining a silent XP leveling system with full-featured YouTube music playback. Members earn XP passively by chatting; stats are only shown on demand — the bot **never sends automatic messages**. Music is streamed from YouTube through yt-dlp and delivered to voice channels with modern DAVE end-to-end encryption.

### The problem

Most public leveling bots spam channels with level-up announcements, and music bots keep breaking as YouTube hardens its bot protections. The need is a **quiet**, **reliable**, self-hosted bot you fully control.

### The solution

| Need | Solution |
|------|----------|
| Passive member engagement | XP per message (15–25 XP, 1 min cooldown) |
| No channel noise | Zero automatic messages — stats via `/stats` only |
| Persistent data | SQLite database (better-sqlite3, WAL mode) |
| Music playback | discord-player 7 + YouTube (youtubei.js) |
| Bot-protection resilience | Audio streamed through yt-dlp |
| Voice encryption | DAVE protocol (@snazzah/davey) |
| Instant commands | Slash commands, guild-scoped deployment |

---

## Architecture

```
Discord server
      │ slash commands / messages
      ▼
Discord Gateway (WSS)
      │
      ▼
Node.js bot — discord.js 14
      │
      ├── XP system ──► SQLite (data/bot.sqlite)
      │                  └── /stats · /leaderboard
      │
      └── Music player — discord-player 7
              │
              ▼
        yt-dlp ──► YouTube audio stream
              │
              ▼
        FFmpeg → Opus (mediaplex) → DAVE encryption
              │
              ▼
        Voice channel 🔊
```

---

## Commands

| Command | Category | Description |
|---------|----------|-------------|
| `/stats [membre]` | 📊 Levels | Level, total XP, server rank, progress bar |
| `/leaderboard` | 📊 Levels | Server top 10 by XP |
| `/play <query>` | 🎵 Music | Play a YouTube link or search query |
| `/skip` | 🎵 Music | Skip to the next track |
| `/pause` / `/resume` | 🎵 Music | Pause / resume playback |
| `/queue` | 🎵 Music | Show the current queue |
| `/nowplaying` | 🎵 Music | Current track with progress bar |
| `/volume <0-100>` | 🎵 Music | Set playback volume |
| `/stop` | 🎵 Music | Stop and leave the voice channel |
| `/ping` | 🔧 Utils | Bot latency |
| `/help` | 🔧 Utils | Command list |

---

## XP system

- **15–25 XP** per message, with a **1-minute cooldown** per member
- MEE6-style level curve: `5·level² + 50·level + 100` XP per level
- Fully silent: no level-up announcements, ever
- Stored per guild in SQLite — survives restarts

---

## Getting started

### Prerequisites

- Node.js ≥ 18
- A Discord application ([developer portal](https://discord.com/developers/applications)) with:
  - the bot **token** (Bot tab → *Reset Token*)
  - **Message Content Intent** enabled (Bot tab → *Privileged Gateway Intents*)
  - the **Application ID** (General Information tab)

### Install & configure

```bash
npm install
```

Copy `.env.example` to `.env` and fill it in:

```env
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
GUILD_ID=your_test_server_id   # optional: instant slash command deployment
```

### Invite the bot

Replace `YOUR_CLIENT_ID` and open:

```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot+applications.commands&permissions=3197952
```

### Deploy commands & run

```bash
npm run deploy   # registers slash commands (re-run after adding/changing a command)
npm start        # starts the bot
```

---

## Repository structure

```
bot-discord/
├── src/
│   ├── index.js               # Entry point — client, command/event loader, music player
│   ├── deploy-commands.js     # Slash command registration (guild or global)
│   ├── database.js            # SQLite setup + prepared statements
│   ├── xp.js                  # XP gain, cooldown and level curve logic
│   ├── events/
│   │   ├── ready.js           # Startup + presence
│   │   ├── interactionCreate.js  # Slash command dispatcher
│   │   └── messageCreate.js   # Silent XP accrual
│   └── commands/
│       ├── levels/            # stats, leaderboard
│       ├── music/             # play, skip, stop, pause, resume, queue, nowplaying, volume
│       └── utils/             # ping, help
├── data/                      # SQLite database (auto-created, git-ignored)
├── .env.example
└── package.json               # youtubei.js pinned to v17 via overrides
```

---

## Notes

- The database is created automatically at `data/bot.sqlite` on first run.
- YouTube playback streams through **yt-dlp** (`useYoutubeDL`), which is far more resilient to
  YouTube's bot protections; if playback ever breaks, update with
  `npm update discord-player discord-player-youtubei youtube-dl-exec`.
- Set `DP_DEBUG=1` in `.env` to enable verbose music player logs in the console.

---

<div align="center">
  <sub>bot-discord · XP leveling & YouTube music for Discord</sub>
</div>
