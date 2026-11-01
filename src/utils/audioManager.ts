/**
 * High-quality procedural cosmic audio synthesizer and sound effect player
 * Built on Web Audio API with zero external audio file dependencies,
 * but seamlessly supports custom MP3 files if configured.
 */

class CosmicAudioManager {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isSynthesizedPlaying: boolean = false;
  private synthInterval: number | null = null;
  private customAudio: HTMLAudioElement | null = null;
  private isUsingCustomAudio: boolean = false;
  private volume: number = 0.6;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.musicGain.connect(this.ctx.destination);
      
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.isMuted ? 0 : Math.min(1, this.volume * 1.2), this.ctx.currentTime);
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    const effectiveVol = this.isMuted ? 0 : this.volume;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(effectiveVol * 0.4, this.ctx.currentTime, 0.05);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(effectiveVol, this.ctx.currentTime, 0.05);
    }
    if (this.customAudio) {
      this.customAudio.volume = effectiveVol;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.setVolume(this.volume);
  }

  public playPortalSfx() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Cosmic riser sweep
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 1.2);
      
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
      
      osc.connect(gain);
      gain.connect(this.sfxGain);
      
      osc.start(now);
      osc.stop(now + 1.4);
    } catch (e) {
      console.warn('Audio sfx error', e);
    }
  }

  public playBlowCandleSfx() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      
      // Wind / breath noise puff
      const bufferSize = this.ctx.sampleRate * 0.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(150, now + 0.4);
      filter.Q.value = 3.0;
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);
      
      noise.start(now);
      noise.stop(now + 0.5);

      // Celestial chime celebration
      setTimeout(() => this.playChimeCelebration(), 250);
    } catch (e) {
      console.warn('Audio sfx error', e);
    }
  }

  public playChimeCelebration() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C E G C E
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const noteTime = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);
        
        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.8);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start(noteTime);
        osc.stop(noteTime + 0.9);
      });
    } catch (e) {
      console.warn('Audio sfx error', e);
    }
  }

  public playGiftOpenSfx() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Sparkle chime sequence
      const freqs = [392.00, 523.25, 659.25, 783.99, 1046.50, 1567.98];
      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const time = now + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0.2, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.7);
        
        osc.connect(gain);
        gain.connect(this.sfxGain);
        
        osc.start(time);
        osc.stop(time + 0.8);
      });
    } catch (e) {
      console.warn('Audio sfx error', e);
    }
  }

  public playFireworkSfx() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      // Low boom + pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);
      
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.connect(gain);
      gain.connect(this.sfxGain);
      
      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn('Audio sfx error', e);
    }
  }

  public playButtonSfx() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain || this.isMuted) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      
      osc.connect(gain);
      gain.connect(this.sfxGain);
      
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.warn('Audio sfx error', e);
    }
  }

  /**
   * Ambient Cosmic Lofi / Music Box Synthesizer
   * Plays a dreamy, comforting cosmic rendition of Happy Birthday & star chords.
   */
  public startBackgroundMusic(customSource?: string) {
    this.initContext();

    if (customSource) {
      if (!this.customAudio) {
        this.customAudio = new Audio(customSource);
        this.customAudio.loop = true;
        this.customAudio.volume = this.isMuted ? 0 : this.volume * 0.7;
      }
      this.customAudio.play().then(() => {
        this.isUsingCustomAudio = true;
      }).catch(() => {
        // Fallback to procedural synth if file cannot be loaded
        this.startCosmicSynth();
      });
      return;
    }

    this.startCosmicSynth();
  }

  private startCosmicSynth() {
    if (this.isSynthesizedPlaying) return;
    this.isSynthesizedPlaying = true;

    // Ambient chords and gentle birthday notes in celestial pentatonic scale
    // C4, D4, E4, G4, A4, C5, D5, E5, G5
    const birthdayNotes = [
      261.63, 261.63, 293.66, 261.63, 349.23, 329.63, // Happy birthday to you
      261.63, 261.63, 293.66, 261.63, 392.00, 349.23, // Happy birthday to you
      261.63, 261.63, 523.25, 440.00, 349.23, 329.63, 293.66, // Happy birthday dear friend
      466.16, 466.16, 440.00, 349.23, 392.00, 349.23  // Happy birthday to you
    ];

    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.isSynthesizedPlaying || !this.ctx || !this.musicGain || this.isMuted) return;

      const freq = birthdayNotes[noteIndex % birthdayNotes.length];
      noteIndex++;

      const now = this.ctx.currentTime;

      // Soft music-box chime oscillator
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Subtle warm detune
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      // Attack, sustain, long warm decay
      noteGain.gain.setValueAtTime(0.001, now);
      noteGain.gain.linearRampToValueAtTime(0.12, now + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(noteGain);
      noteGain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 1.3);

      // Play soft harmonic drone pad every 4th note
      if (noteIndex % 4 === 0) {
        const drone = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        drone.type = 'triangle';
        drone.frequency.setValueAtTime(freq * 0.5, now); // Octave lower

        droneGain.gain.setValueAtTime(0.001, now);
        droneGain.gain.linearRampToValueAtTime(0.04, now + 0.2);
        droneGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

        drone.connect(droneGain);
        droneGain.connect(this.musicGain);

        drone.start(now);
        drone.stop(now + 2.2);
      }
    };

    // Play every 750ms in relaxed dreamy tempo
    this.synthInterval = window.setInterval(playNextNote, 750);
    playNextNote();
  }

  public pauseBackgroundMusic() {
    if (this.isUsingCustomAudio && this.customAudio) {
      this.customAudio.pause();
    }
    this.isSynthesizedPlaying = false;
    if (this.synthInterval !== null) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  public isPlaying(): boolean {
    if (this.isUsingCustomAudio && this.customAudio) {
      return !this.customAudio.paused;
    }
    return this.isSynthesizedPlaying;
  }
}

export const audioManager = new CosmicAudioManager();
