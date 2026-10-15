import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getEvents, getGallery } from '../src/services/mediaService.js';

test('admin media lists do not show fallback records when the database is empty', async () => {
  const previous = globalThis.window;
  globalThis.window = { RuchiBackend: { media: {
    getAllGallery: async () => ({ data: [] }),
    getAllEvents: async () => ({ data: [] }),
  } } };
  try {
    assert.deepEqual(await getGallery(true), []);
    assert.deepEqual(await getEvents(true), []);
  } finally {
    globalThis.window = previous;
  }
});
