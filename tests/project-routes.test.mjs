import assert from 'node:assert/strict';
import { test } from 'node:test';
import { normalizePublicProjects } from '../src/server/normalize-projects.mjs';

test('admin-created projects without a stored slug resolve at their public URL', () => {
  const project = normalizePublicProjects([{ id: 'test-id', title: 'Test', location: 'Test', image_url: '/test.webp' }])
    .find((item) => item.id === 'test-id');
  assert.equal(project.slug, 'test-test');
  assert.equal(project.url, '/projects/test-test');
});

test('database updates keep established project routes', () => {
  const project = normalizePublicProjects([{ id: 'oscar-id', title: 'Oscar Pride', location: 'Indore', image_url: '' }])
    .find((item) => item.id === 'oscar-id');
  assert.equal(project.slug, 'oscar-pride-indore');
  assert.equal(project.url, '/projects/oscar-pride-indore');
  assert.ok(project.image_url);
});
