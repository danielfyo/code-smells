export interface Draft {
  title: string;
  body: string;
  tags: string[];
}

export interface Published {
  slug: string;
  html: string;
  readingMinutes: number;
}

const WORDS_PER_MINUTE = 200;

// REFACTOR: Extract Function until each function has a single level of
// abstraction (Composed Method). `publishArticle` reads like a table of contents
// of steps; the details live in lower-level functions.
export function publishArticle(draft: Draft, store: Map<string, Published>): Published {
  assertComplete(draft);
  const published: Published = {
    slug: slugify(draft.title),
    html: renderHtml(draft),
    readingMinutes: readingTime(draft.body),
  };
  store.set(published.slug, published);
  return published;
}

function assertComplete({ title, body }: Draft): void {
  if (title.trim() === "" || body.trim() === "") throw new Error("Incomplete draft");
}

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function renderHtml({ title, body, tags }: Draft): string {
  const paragraphs = body.split("\n\n").map((p) => `<p>${p}</p>`).join("");
  const footer = tags.length ? `<footer>${tags.map((t) => `#${t}`).join(" ")}</footer>` : "";
  return `<article><h1>${title}</h1>${paragraphs}${footer}</article>`;
}

export function readingTime(body: string): number {
  const words = body.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
