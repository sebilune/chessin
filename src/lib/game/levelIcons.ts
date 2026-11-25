import type { IconData } from "@animateicons/vanilla";
import {
  Layers,
  Tornado,
  ShieldLock,
  Dog,
  Target,
  CloudLightning,
  Fish,
  Swords,
  Flag,
  Brain,
  Atom,
  Hammer,
  Key,
  Gem,
  Crown,
} from "@animateicons/vanilla/lucide";

/**
 * Animated icon mapping for levels 49 to 63.
 * Level 64 uses a custom King piece SVG underlay.
 */
export const LEVEL_ANIMATED_ICONS: Record<number, IconData> = {
  49: Layers, // Phalanx
  50: Tornado, // Vortex II
  51: ShieldLock, // Iron Curtain
  52: Dog, // Bloodhound
  53: Target, // Steel Trap
  54: CloudLightning, // Storming Heaven
  55: Gem, // Obsidian Core
  56: Swords, // Castle Siege
  57: Flag, // Checkmate Alley
  58: Brain, // Grandmaster's Trap
  59: Atom, // The Crucible
  60: Hammer, // Anvil & Hammer
  61: Key, // Endgame Enigma
  62: Crown, // Crown of Thorns
  63: Fish, // Stockfish's Pond
};

export const CHALLENGE_TIER_START_ID = 49;
export const KING_LEVEL_ID = 64;

export function isChallengeTierLevel(levelId: number): boolean {
  return levelId >= CHALLENGE_TIER_START_ID && levelId <= KING_LEVEL_ID;
}

export function isKingLevel(levelId: number): boolean {
  return levelId === KING_LEVEL_ID;
}

export function getLevelAnimatedIcon(levelId: number): IconData | null {
  return LEVEL_ANIMATED_ICONS[levelId] ?? null;
}
