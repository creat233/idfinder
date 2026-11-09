/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { canBookSlot } from './bookingSlots';

describe('visitor appointment availability', () => {
  const now = new Date('2026-11-09T08:00:00');
  test('configured free slots can be chosen', () => {
    expect(canBookSlot('2026-11-09', { start_time: '09:00:00', end_time: '10:00:00', is_reserved: false }, now)).toBe(true);
  });
  test('already reserved slots cannot be chosen', () => {
    expect(canBookSlot('2026-11-09', { start_time: '09:00:00', end_time: '10:00:00', is_reserved: true }, now)).toBe(false);
  });
  test('past slots cannot be chosen', () => {
    expect(canBookSlot('2026-11-09', { start_time: '07:00:00', end_time: '08:00:00', is_reserved: false }, now)).toBe(false);
  });
});