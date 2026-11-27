import { Howl, Howler } from "howler";

type SoundName =
  "capture" | "stuck" | "victory" | "hint" | "undo" | "redo" | "reset";

const SOUND_PATHS: Record<SoundName, string> = {
  capture: "/sounds/capture.mp3",
  stuck: "/sounds/stuck.mp3",
  victory: "/sounds/victory.mp3",
  hint: "/sounds/hint.mp3",
  undo: "/sounds/undo.mp3",
  redo: "/sounds/redo.mp3",
  reset: "/sounds/reset.mp3",
};

const SOUND_VOLUMES: Record<SoundName, number> = {
  capture: 0.68,
  stuck: 0.75,
  victory: 0.72,
  hint: 0.7,
  undo: 0.56,
  redo: 0.56,
  reset: 0.42,
};

class SoundManager {
  private sounds = new Map<SoundName, Howl>();

  public enabled = true;

  constructor() {
    if (typeof window === "undefined") return;

    for (const [name, src] of Object.entries(SOUND_PATHS) as [
      SoundName,
      string,
    ][]) {
      this.sounds.set(
        name,
        new Howl({
          src: [src],
          preload: true,
          volume: SOUND_VOLUMES[name],
        }),
      );
    }
  }

  public get volume(): number {
    return Howler.volume();
  }

  public set volume(value: number) {
    Howler.volume(value);
  }

  private play(name: SoundName): void {
    if (!this.enabled || this.volume <= 0) return;
    this.sounds.get(name)?.play();
  }

  public playCapture(): void {
    this.play("capture");
  }

  public playStuck(): void {
    this.play("stuck");
  }

  public playHint(): void {
    this.play("hint");
  }

  public playUndo(): void {
    this.play("undo");
  }

  public playRedo(): void {
    this.play("redo");
  }

  public playReset(): void {
    this.play("reset");
  }

  public playVictory(): void {
    this.play("victory");
  }
}

export const sound = new SoundManager();
