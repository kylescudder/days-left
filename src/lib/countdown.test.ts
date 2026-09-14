import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { getCountdownValues } from './countdown';

describe('UK wall-clock countdown', () => {
  test('does not add an hour when the countdown crosses from BST to GMT', () => {
    const now = new Date('2026-09-14T16:17:39+01:00');
    const { days, hours, minutes, seconds } = getCountdownValues(now);

    assert.deepEqual({ days, hours, minutes, seconds }, {
      days: 136,
      hours: 23,
      minutes: 42,
      seconds: 21,
    });
  });

  test('finishes at 4pm UK time on 29 January 2027', () => {
    const deadline = new Date('2027-01-29T16:00:00Z');

    assert.equal(getCountdownValues(deadline).distance, 0);
  });
});
