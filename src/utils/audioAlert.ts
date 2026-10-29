// Web Audio API Synthesizer for Departure Alarms & Radar Pings

class AudioAlertEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Executive three-tone harmonic chime
  playExecutiveChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        gain.gain.setValueAtTime(0, now + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.14 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.65);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.7);
      });
    } catch (e) {
      console.warn('Web Audio playback failed:', e);
    }
  }

  // Subtle two-tone chime
  playSubtleChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const notes = [440, 554.37]; // A4, C#5

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.15);

        gain.gain.setValueAtTime(0, now + idx * 0.15);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.15 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.15 + 0.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.15);
        osc.stop(now + idx * 0.15 + 0.55);
      });
    } catch (e) {
      console.warn('Web Audio playback failed:', e);
    }
  }

  // Urgent departure alert
  playUrgentChime() {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const freqs = [880, 880, 1046.5]; // A5, A5, C6

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.45);
      });
    } catch (e) {
      console.warn('Web Audio playback failed:', e);
    }
  }

  playByType(type: 'executive' | 'subtle' | 'urgent') {
    if (type === 'subtle') this.playSubtleChime();
    else if (type === 'urgent') this.playUrgentChime();
    else this.playExecutiveChime();
  }
}

export const audioAlert = new AudioAlertEngine();
