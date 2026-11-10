import { describe, it, expect, beforeEach } from 'vitest';
import { BirthdayConfigSchema, birthdayConfig } from '@/config/birthday.config';
import { useExperienceStore, SCENE_ORDER } from '@/stores/useExperienceStore';

describe('Birthday Configuration Validation', () => {
  it('validates configuration matches BirthdayConfigSchema', () => {
    const parseResult = BirthdayConfigSchema.safeParse(birthdayConfig);
    expect(parseResult.success).toBe(true);
  });

  it('contains valid recipient and sender names', () => {
    expect(birthdayConfig.recipientName).toBeTruthy();
    expect(birthdayConfig.senderName).toBeTruthy();
    expect(birthdayConfig.hero.ctaText).toBeTruthy();
  });

  it('contains at least 4 memories with valid fields', () => {
    expect(birthdayConfig.memories.length).toBeGreaterThanOrEqual(4);
    birthdayConfig.memories.forEach((mem) => {
      expect(mem.id).toBeTruthy();
      expect(mem.title).toBeTruthy();
      expect(mem.image).toBeTruthy();
      expect(mem.date).toBeTruthy();
    });
  });

  it('contains at least 4 timeline events', () => {
    expect(birthdayConfig.timeline.length).toBeGreaterThanOrEqual(4);
    birthdayConfig.timeline.forEach((event) => {
      expect(event.id).toBeTruthy();
      expect(event.title).toBeTruthy();
      expect(event.date).toBeTruthy();
    });
  });

  it('contains full secret gift rewards and sincere letter', () => {
    expect(birthdayConfig.gift.rewardDetails.length).toBeGreaterThanOrEqual(2);
    expect(birthdayConfig.letter.paragraphs.length).toBeGreaterThanOrEqual(3);
  });
});

describe('Experience Store State Transitions', () => {
  beforeEach(() => {
    useExperienceStore.getState().resetExperience();
  });

  it('initializes at portal scene', () => {
    const state = useExperienceStore.getState();
    expect(state.currentScene).toBe('portal');
    expect(state.hasEntered).toBe(false);
    expect(state.candleBlown).toBe(false);
    expect(state.giftOpened).toBe(false);
    expect(state.letterRead).toBe(false);
  });

  it('transitions to cake scene on enterPortal', () => {
    useExperienceStore.getState().enterPortal();
    const state = useExperienceStore.getState();
    expect(state.hasEntered).toBe(true);
    expect(state.currentScene).toBe('cake');
  });

  it('advances through scenes correctly with nextScene and prevScene', () => {
    useExperienceStore.getState().enterPortal(); // at 'cake'
    expect(useExperienceStore.getState().currentScene).toBe('cake');

    useExperienceStore.getState().nextScene(); // to 'memories'
    expect(useExperienceStore.getState().currentScene).toBe('memories');

    useExperienceStore.getState().nextScene(); // to 'gift'
    expect(useExperienceStore.getState().currentScene).toBe('gift');

    useExperienceStore.getState().nextScene(); // to 'bouquet'
    expect(useExperienceStore.getState().currentScene).toBe('bouquet');

    useExperienceStore.getState().prevScene(); // back to 'gift'
    expect(useExperienceStore.getState().currentScene).toBe('gift');

    useExperienceStore.getState().prevScene(); // back to 'memories'
    expect(useExperienceStore.getState().currentScene).toBe('memories');
  });

  it('records interactions: candle blow, gift open, bouquet bloom, petal burst, letter read', () => {
    useExperienceStore.getState().setCandleBlown(true);
    expect(useExperienceStore.getState().candleBlown).toBe(true);

    useExperienceStore.getState().setGiftOpened(true);
    expect(useExperienceStore.getState().giftOpened).toBe(true);

    useExperienceStore.getState().setBouquetBloomed(true);
    expect(useExperienceStore.getState().bouquetBloomed).toBe(true);

    useExperienceStore.getState().triggerPetalBurst();
    expect(useExperienceStore.getState().petalBurstCount).toBe(1);

    useExperienceStore.getState().setLetterRead(true);
    expect(useExperienceStore.getState().letterRead).toBe(true);
  });

  it('resets experience completely when resetExperience is called', () => {
    useExperienceStore.getState().enterPortal();
    useExperienceStore.getState().setCandleBlown(true);
    useExperienceStore.getState().setGiftOpened(true);

    useExperienceStore.getState().resetExperience();
    const state = useExperienceStore.getState();
    expect(state.currentScene).toBe('portal');
    expect(state.hasEntered).toBe(false);
    expect(state.candleBlown).toBe(false);
    expect(state.giftOpened).toBe(false);
  });
});

