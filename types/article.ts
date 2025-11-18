export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
  imageUrl?: string;
  source: string;
  url?: string;
  category?: string;
  isUserCreated: boolean;
}

export interface NewsAPIArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export type ArticleCategory = 'general' | 'technology' | 'business' | 'entertainment' | 'sports' | 'science' | 'health';
