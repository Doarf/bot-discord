const { statements } = require('./database');

// XP nécessaire pour passer du niveau `level` au niveau suivant (formule type MEE6)
function xpForLevel(level) {
  return 5 * level * level + 50 * level + 100;
}

// Cooldown en mémoire : 1 gain d'XP max par minute et par membre
const cooldowns = new Map();
const COOLDOWN_MS = 60_000;

/**
 * Ajoute de l'XP à un membre suite à un message.
 * @returns {{ leveledUp: boolean, level: number } | null} null si en cooldown
 */
function addXpForMessage(guildId, userId, username) {
  const key = `${guildId}:${userId}`;
  const now = Date.now();
  const last = cooldowns.get(key) ?? 0;
  if (now - last < COOLDOWN_MS) return null;
  cooldowns.set(key, now);

  const gain = 15 + Math.floor(Math.random() * 11); // 15 à 25 XP
  const row = statements.getUser.get(guildId, userId) ?? { xp: 0, level: 0, total_xp: 0 };

  let xp = row.xp + gain;
  let level = row.level;
  let leveledUp = false;

  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
    leveledUp = true;
  }

  statements.upsertUser.run({
    guild_id: guildId,
    user_id: userId,
    username,
    xp,
    level,
    total_xp: row.total_xp + gain,
  });

  return { leveledUp, level };
}

module.exports = { xpForLevel, addXpForMessage };
