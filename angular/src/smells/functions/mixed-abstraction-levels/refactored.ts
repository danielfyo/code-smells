import type { Draft, PublishedArticle } from './model';

const WORDS_PER_MINUTE = 200;

// REFACTOR: Compose Method / Extract Function. `publish` speaks only at the business level; each
// low-level detail lives in a small helper with a single level of abstraction.
export function publish(draft: Draft): PublishedArticle {
  assertComplete(draft);
  return {
    slug: slugify(draft.title),
    readingMinutes: readingMinutes(draft.body),
    html: renderArticle(draft),
  };
}

function assertComplete({ title, body }: Draft): void {
  if (title.trim().length === 0 || body.trim().length === 0) {
    throw new Error('Title and body are required');
  }
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function readingMinutes(body: string): number {
  const words = body.split(/\s+/).filter((word) => word.length > 0).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function renderArticle({ title, author, body }: Draft): string {
  const paragraphs = body.split('\n\n').map((p) => `<p>${p}</p>`).join('');
  return `<article><h1>${title}</h1><p class="byline">by ${author}</p>${paragraphs}</article>`;
}
