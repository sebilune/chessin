type SoundName = 'capture' | 'stuck' | 'victory' | 'hint' | 'undo' | 'redo';

const SOUND_PATHS: Record<SoundName, string> = {
  capture: '/sounds/capture.mp3',
  stuck: '/sounds/stuck.mp3',
  victory: '/sounds/victory.mp3',
  hint: '/sounds/hint.mp3',
  undo: '/sounds/undo.mp3',
  redo: '/sounds/redo.mp3',
};

const SOUND_VOLUMES: Record<SoundName, number> = {
  capture: 0.68,
  stuck: 0.75,
  victory: 0.72,
  hint: 0.7,
  undo: 0.56,
  redo: 0.56,
};

const MIN_REPEAT_MS = 35;
const MAX_RESUME_WAIT_MS = 120;

/**
 * Loads and plays pre-decoded sound files via Web Audio API
 * for low-latency, non-stacking playback across Firefox and Chrome.
 */
class SoundManager {
  private ctx: AudioContext | null = null;
  private buffers = new Map<SoundName, AudioBuffer>();
  private loadingPromise: Promise<void> | null = null;
  private activeSource: AudioBufferSourceNode | null = null;
  private lastPlayedAt = new Map<SoundName, number>();
  private pendingPlayToken = 0;

  public enabled = true;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx({ latencyHint: 'interactive' });
      void this.preload(this.ctx);
    }

    return this.ctx;
  }

  private preload(ctx: AudioContext): Promise<void> {
    if (this.loadingPromise) return this.loadingPromise;

    const entries = Object.entries(SOUND_PATHS) as [SoundName, string][];
    this.loadingPromise = Promise.all(
      entries.map(async ([name, url]) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return;
          const data = await res.arrayBuffer();
          const buffer = await ctx.decodeAudioData(data);
          this.buffers.set(name, buffer);
        } catch {
          // Ignore individual load/decode failures
        }
      }),
    ).then(() => undefined);

    return this.loadingPromise;
  }

  private playBuffer(ctx: AudioContext, name: SoundName, allowOverlap: boolean): void {
    const buffer = this.buffers.get(name);
    if (!buffer) return;

    if (!allowOverlap && this.activeSource) {
      try {
        this.activeSource.stop();
      } catch {
        // Source may have already finished
      }
      this.activeSource = null;
    }

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    gain.gain.value = SOUND_VOLUMES[name];

    source.connect(gain);
    gain.connect(ctx.destination);

    if (!allowOverlap) {
      this.activeSource = source;
    }

    source.onended = () => {
      if (this.activeSource === source) {
        this.activeSource = null;
      }
      source.disconnect();
      gain.disconnect();
    };

    source.start(0);
  }

  private play(name: SoundName, allowOverlap = false): void {
    if (!this.enabled) return;

    const nowMs = performance.now();
    const prevMs = this.lastPlayedAt.get(name) ?? -Infinity;
    if (!allowOverlap && nowMs - prevMs < MIN_REPEAT_MS) return;
    this.lastPlayedAt.set(name, nowMs);

    const ctx = this.getContext();
    if (!ctx) return;

    if (ctx.state === 'running' && this.buffers.has(name)) {
      this.playBuffer(ctx, name, allowOverlap);
      return;
    }

    const token = ++this.pendingPlayToken;
    const requestedAt = performance.now();

    Promise.all([
      ctx.state === 'suspended' ? ctx.resume().catch(() => undefined) : Promise.resolve(),
      this.preload(ctx),
    ]).then(() => {
      if (!this.enabled || ctx.state !== 'running') return;
      if (token !== this.pendingPlayToken) return;
      if (performance.now() - requestedAt > MAX_RESUME_WAIT_MS) return;
      this.playBuffer(ctx, name, allowOverlap);
    });
  }

  public playCapture(): void {
    this.play('capture');
  }

  public playStuck(): void {
    this.play('stuck');
  }

  public playHint(): void {
    this.play('hint');
  }

  public playUndo(): void {
    this.play('undo');
  }

  public playRedo(): void {
    this.play('redo');
  }

  public playVictory(): void {
    this.play('victory', true);
  }
}

export const sound = new SoundManager();
