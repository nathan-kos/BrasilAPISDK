import { getAllPixParticipant } from '@src/index';
import { describe, expect, it } from 'vitest';

describe('get all pix participant - integration', () => {
  it('should fetch all pix participants', async () => {
    const participants = await getAllPixParticipant();

    expect(Array.isArray(participants)).toBe(true);
    expect(participants.length).toBeGreaterThan(0);

    participants.forEach((participant) => {
      expect(participant).toHaveProperty('ispb');
      expect(participant).toHaveProperty('name');
      expect(participant).toHaveProperty('reducedName');
      expect(participant).toHaveProperty('participationModality');
      expect(participant).toHaveProperty('participationType');
      expect(participant).toHaveProperty('operationStartDate');
    });
  });
});
