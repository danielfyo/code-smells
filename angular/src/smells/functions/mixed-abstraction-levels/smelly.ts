import type { Draft, PublishedArticle } from './model';

// SMELL: Mixed Levels of Abstraction. "Validate, build the slug, estimate reading time, render"
// is the story, but it is interleaved with regexes, character loops and string concatenation.
// The reader keeps switching between "what" and "how".
export function publish(draft: Draft): PublishedArticle {
  if (draft.title.trim().length === 0 || draft.body.trim().length === 0) {
    throw new Error('Title and body are required');
  }
  let slug = '';
  for (const ch of draft.title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')) {
    if (/[a-z0-9]/.test(ch)) slug += ch;
    else if (!slug.endsWith('-')) slug += '-';
  }
  slug = slug.replace(/^-|-$/g, '');
  const words = draft.body.split(/\s+/).filter((w) => w.length > 0).length;
  const readingMinutes = Math.max(1, Math.ceil(words / 200));
  const html =
    '<article><h1>' + draft.title + '</h1><p class="byline">by ' + draft.author + '</p>' +
    draft.body.split('\n\n').map((p) => '<p>' + p + '</p>').join('') + '</article>';
  return { slug, readingMinutes, html };
}
