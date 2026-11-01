import confetti from 'canvas-confetti';

export function triggerBirthdayConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#6D4AFF', '#E879F9', '#38BDF8', '#FACC15', '#FFFFFF'],
    disableForReducedMotion: true,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });
  fire(0.2, {
    spread: 60,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

export function triggerStarShower() {
  const duration = 2.5 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#FACC15', '#38BDF8', '#E879F9'],
      shapes: ['star', 'circle'],
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#6D4AFF', '#FACC15', '#FFFFFF'],
      shapes: ['star', 'circle'],
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

export function triggerGiftSparkles() {
  confetti({
    particleCount: 100,
    spread: 80,
    origin: { y: 0.5, x: 0.5 },
    colors: ['#FACC15', '#FEF08A', '#E879F9', '#38BDF8', '#FFFFFF'],
    shapes: ['star', 'circle'],
    scalar: 1.1,
  });
}
