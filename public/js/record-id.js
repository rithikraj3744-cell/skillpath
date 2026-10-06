export const validRecordId = value => typeof value === 'string' &&
  !['constructor', 'prototype'].includes(value) && /^[a-z0-9][a-z0-9_-]{0,79}$/.test(value);

export function suggestRecordId(value) {
  const slug = String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80).replace(/-+$/g, '');
  return ['constructor', 'prototype'].includes(slug) ? 'skill-' + slug : slug;
}

export const recordIdHelp = 'Use 1–80 lowercase letters, numbers, hyphens or underscores. Start with a letter or number; for example, python-basics.';
