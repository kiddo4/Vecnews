import { Article, NewsAPIArticle, ArticleCategory } from '@/types/article';

const NEWS_API_KEY = '701f2b6934d548edab8b36f27393c5a7'; // Users should replace with their own key from newsapi.org
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Fallback to sample articles if API key is not set or request fails
const SAMPLE_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Breaking: Major Breakthrough in AI Technology',
    description: 'Scientists announce revolutionary advancement in artificial intelligence capabilities.',
    content: 'In a groundbreaking development, researchers have unveiled a new AI system that demonstrates unprecedented capabilities in understanding and generating human-like responses. This advancement marks a significant milestone in the field of artificial intelligence...',
    author: 'Tech News Team',
    publishedAt: new Date().toISOString(),
    imageUrl: 'https://via.placeholder.com/400x200/4A90E2/ffffff?text=AI+Technology',
    source: 'VecNews',
    category: 'technology',
    isUserCreated: false,
  },
  {
    id: '2',
    title: 'Global Markets Show Strong Recovery',
    description: 'Stock markets worldwide experience significant gains amid positive economic indicators.',
    content: 'Financial markets across the globe are showing remarkable resilience as investors respond positively to recent economic data. The recovery signals growing confidence in the global economy...',
    author: 'Business Desk',
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    imageUrl: 'https://via.placeholder.com/400x200/50C878/ffffff?text=Markets',
    source: 'VecNews',
    category: 'business',
    isUserCreated: false,
  },
  {
    id: '3',
    title: 'New Study Reveals Health Benefits of Mediterranean Diet',
    description: 'Research confirms long-term advantages of traditional Mediterranean eating patterns.',
    content: 'A comprehensive study involving thousands of participants has reinforced the health benefits associated with the Mediterranean diet. The findings suggest significant improvements in cardiovascular health...',
    author: 'Health & Wellness',
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    imageUrl: 'https://via.placeholder.com/400x200/FF6B6B/ffffff?text=Health+News',
    source: 'VecNews',
    category: 'health',
    isUserCreated: false,
  },
];

function transformNewsAPIArticle(apiArticle: NewsAPIArticle): Article {
  return {
    id: `news-${Date.now()}-${Math.random()}`,
    title: apiArticle.title,
    description: apiArticle.description || 'No description available',
    content: apiArticle.content || apiArticle.description || 'Read more at source',
    author: apiArticle.author || apiArticle.source.name,
    publishedAt: apiArticle.publishedAt,
    imageUrl: apiArticle.urlToImage || undefined,
    source: apiArticle.source.name,
    url: apiArticle.url,
    isUserCreated: false,
  };
}

export async function fetchTopHeadlines(category?: ArticleCategory): Promise<Article[]> {
  // If no API key is set, return sample articles
  if (NEWS_API_KEY === 'YOUR_NEWS_API_KEY') {
    console.log('Using sample articles. Set NEWS_API_KEY in services/newsApi.ts to fetch real news.');
    return SAMPLE_ARTICLES;
  }

  try {
    const categoryParam = category ? `&category=${category}` : '';
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?country=us${categoryParam}&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      console.warn('News API request failed, using sample articles');
      return SAMPLE_ARTICLES;
    }

    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      return data.articles.map(transformNewsAPIArticle);
    }

    return SAMPLE_ARTICLES;
  } catch (error) {
    console.error('Error fetching news:', error);
    return SAMPLE_ARTICLES;
  }
}

export async function searchNews(query: string): Promise<Article[]> {
  // If no API key is set, filter sample articles
  if (NEWS_API_KEY === 'YOUR_NEWS_API_KEY') {
    const lowercaseQuery = query.toLowerCase();
    return SAMPLE_ARTICLES.filter(
      article =>
        article.title.toLowerCase().includes(lowercaseQuery) ||
        article.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();

    if (data.articles && data.articles.length > 0) {
      return data.articles.map(transformNewsAPIArticle);
    }

    return [];
  } catch (error) {
    console.error('Error searching news:', error);
    return [];
  }
}
