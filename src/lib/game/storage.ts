const STORAGE_KEY = 'chessin_state_v1';

export interface PersistedState {
  completedLevels: number[];
  currentLevelId: number;
  soundEnabled: boolean;
  theme: 'dark' | 'light' | 'system';
}

const DEFAULT_STATE: PersistedState = {
  completedLevels: [],
  currentLevelId: 1,
  soundEnabled: true,
  theme: 'dark',
};

export function loadPersistedState(): PersistedState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw);
    return {
      completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
      currentLevelId: typeof parsed.currentLevelId === 'number' ? parsed.currentLevelId : 1,
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      theme: parsed.theme === 'light' || parsed.theme === 'dark' ? parsed.theme : 'dark',
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export function savePersistedState(state: Partial<PersistedState>) {
  if (typeof window === 'undefined') return;
  try {
    const current = loadPersistedState();
    const updated = { ...current, ...state };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}
