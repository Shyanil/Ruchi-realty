import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mediaScope, planMediaPosition, sortMediaByOrder } from '../src/components/admin/mediaOrder.mjs';

test('entering a position normalizes ties and moves directly to that position', () => {
  const original = [
    { id: 'a', display_order: 0, created_at: '2026-01-01' },
    { id: 'b', display_order: 0, created_at: '2026-01-02' },
    { id: 'c', display_order: 9, created_at: '2026-01-03' },
  ];
  const changes = planMediaPosition(original, 'b', 0, 'press');
  const positions = new Map(changes.map((item) => [item.id, item.display_order]));
  const reordered = original.map((item) => ({ ...item, display_order: positions.get(item.id) ?? item.display_order }));
  assert.deepEqual(sortMediaByOrder(reordered).map((item) => item.id), ['b', 'a', 'c']);
  assert.deepEqual(planMediaPosition(reordered, 'b', 0, 'press'), []);
  assert.deepEqual(sortMediaByOrder(reordered).map((item) => item.display_order), [0, 1, 2]);
});

test('gallery order is independent for every category', () => {
  const original = [
    { id: 'video-a', category: 'Videos', display_order: 0 },
    { id: 'event-a', category: 'Events', display_order: 0 },
    { id: 'video-b', category: 'Videos', display_order: 1 },
    { id: 'office-a', category: 'Office Culture', display_order: 0 },
  ];
  const changes = planMediaPosition(original, 'video-b', 0, 'gallery');
  assert.deepEqual(changes.map((item) => item.id), ['video-b', 'video-a']);
  const positions = new Map(changes.map((item) => [item.id, item.display_order]));
  const reordered = original.map((item) => ({ ...item, display_order: positions.get(item.id) ?? item.display_order }));
  assert.deepEqual(mediaScope(reordered, original[0], 'gallery').map((item) => item.id), ['video-b', 'video-a']);
  assert.equal(reordered.find((item) => item.id === 'event-a').display_order, 0);
  assert.equal(reordered.find((item) => item.id === 'office-a').display_order, 0);
  assert.deepEqual(planMediaPosition(reordered, 'event-a', 0, 'gallery'), []);
});

test('press order uses its date to break legacy ties', () => {
  const records = [
    { id: 'older', display_order: 0, release_date: '2025-01-01' },
    { id: 'newer', display_order: 0, release_date: '2026-01-01' },
  ];
  assert.deepEqual(sortMediaByOrder(records).map((item) => item.id), ['newer', 'older']);
});
