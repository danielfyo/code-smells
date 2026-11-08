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

// SMELL: Mixed Levels of Abstraction. The function mixes high-level steps
// ("validate", "publish") with very low-level details: walking characters one by
// one, concatenating HTML tags and counting spaces. The reader must constantly
// go up and down levels to follow along.
export function publishArticle(draft: Draft, store: Map<string, Published>): Published {
  if (draft.title.trim() === "" || draft.body.trim() === "") throw new Error("Incomplete draft");

  // low level: slug character by character
  let slug = "";
  const lower = draft.title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  for (const ch of lower) {
    if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")) slug += ch;
    else if (!slug.endsWith("-")) slug += "-";
  }
  slug = slug.replace(/^-|-$/g, "");

  // low level: hand-made HTML
  let html = "<article><h1>" + draft.title + "</h1>";
  for (const paragraph of draft.body.split("\n\n")) html += "<p>" + paragraph + "</p>";
  if (draft.tags.length) html += "<footer>" + draft.tags.map((t) => "#" + t).join(" ") + "</footer>";
  html += "</article>";

  // low level: counting words
  let words = 0;
  for (const token of draft.body.split(/\s+/)) if (token) words++;

  // high level again
  const published = { slug, html, readingMinutes: Math.max(1, Math.round(words / 200)) };
  store.set(slug, published);
  return published;
}
