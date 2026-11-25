import type { IconData } from '@animateicons/vanilla';
import {
  Layers,
  Tornado,
  ShieldLock,
  Dog,
  Target,
  CloudLightning,
  Flame,
  Swords,
  Flag,
  Brain,
  Atom,
  Hammer,
  Key,
  Gem,
  Crown
} from '@animateicons/vanilla/lucide';

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
  55: Flame, // Dragon's Tail
  56: Swords, // Castle Siege
  57: Flag, // Checkmate Alley
  58: Brain, // Grandmaster's Trap
  59: Atom, // The Crucible
  60: Hammer, // Anvil & Hammer
  61: Key, // Endgame Enigma
  62: Gem, // Obsidian Core
  63: Crown // Crown of Thorns
};

export function getLevelAnimatedIcon(levelId: number): IconData | null {
  return LEVEL_ANIMATED_ICONS[levelId] ?? null;
}
