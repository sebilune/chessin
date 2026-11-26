export const CHALLENGE_TIER_START_ID = 49;
export const KING_LEVEL_ID = 64;

export function isChallengeTierLevel(levelId: number): boolean {
  return levelId >= CHALLENGE_TIER_START_ID && levelId <= KING_LEVEL_ID;
}

export function isKingLevel(levelId: number): boolean {
  return levelId === KING_LEVEL_ID;
}
