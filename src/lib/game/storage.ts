const STORAGE_KEY = "chessin_state_v1";

export interface PersistedState {
  completedLevels: number[];
  currentLevelId: number;
  soundEnabled: boolean;
  theme: "dark" | "light";
}

const DEFAULT_STATE: PersistedState = {
  completedLevels: [],
  currentLevelId: 1,
  soundEnabled: true,
  theme: "dark",
};

let cachedState: PersistedState | null = null;

export function loadPersistedState(): PersistedState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  if (cachedState) return cachedState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      cachedState = { ...DEFAULT_STATE };
      return cachedState;
    }
    const parsed = JSON.parse(raw);
    cachedState = {
      completedLevels: Array.isArray(parsed.completedLevels)
        ? parsed.completedLevels
        : [],
      currentLevelId:
        typeof parsed.currentLevelId === "number" ? parsed.currentLevelId : 1,
      soundEnabled:
        typeof parsed.soundEnabled === "boolean" ? parsed.soundEnabled : true,
      theme:
        parsed.theme === "light" || parsed.theme === "dark"
          ? parsed.theme
          : "dark",
    };
    return cachedState;
  } catch {
    cachedState = { ...DEFAULT_STATE };
    return cachedState;
  }
}

export function savePersistedState(state: Partial<PersistedState>) {
  if (typeof window === "undefined") return;
  try {
    const current = cachedState ?? loadPersistedState();
    const updated: PersistedState = { ...current, ...state };
    cachedState = updated;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {}
}
