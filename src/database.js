const Database = require('better-sqlite3');
const path = require('node:path');
const fs = require('node:fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'bot.sqlite'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    guild_id TEXT NOT NULL,
    user_id  TEXT NOT NULL,
    username TEXT NOT NULL DEFAULT '',
    xp       INTEGER NOT NULL DEFAULT 0,
    level    INTEGER NOT NULL DEFAULT 0,
    total_xp INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (guild_id, user_id)
  );
`);

const statements = {
  getUser: db.prepare('SELECT * FROM users WHERE guild_id = ? AND user_id = ?'),
  upsertUser: db.prepare(`
    INSERT INTO users (guild_id, user_id, username, xp, level, total_xp)
    VALUES (@guild_id, @user_id, @username, @xp, @level, @total_xp)
    ON CONFLICT (guild_id, user_id) DO UPDATE SET
      username = @username, xp = @xp, level = @level, total_xp = @total_xp
  `),
  topUsers: db.prepare('SELECT * FROM users WHERE guild_id = ? ORDER BY total_xp DESC LIMIT ?'),
  rankOf: db.prepare('SELECT COUNT(*) + 1 AS rank FROM users WHERE guild_id = ? AND total_xp > ?'),
};

module.exports = { db, statements };
