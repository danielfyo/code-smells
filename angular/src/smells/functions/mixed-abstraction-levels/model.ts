export interface Draft {
  title: string;
  body: string;
  author: string;
}

export interface PublishedArticle {
  slug: string;
  readingMinutes: number;
  html: string;
}
