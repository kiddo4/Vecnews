import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '@/types/article';

const STORAGE_KEY = '@vecnews_user_posts';

export async function saveUserPost(article: Article): Promise<void> {
  try {
    const existingPosts = await getUserPosts();
    const updatedPosts = [article, ...existingPosts];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  } catch (error) {
    console.error('Error saving post:', error);
    throw error;
  }
}

export async function getUserPosts(): Promise<Article[]> {
  try {
    const posts = await AsyncStorage.getItem(STORAGE_KEY);
    return posts ? JSON.parse(posts) : [];
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
}

export async function deleteUserPost(id: string): Promise<void> {
  try {
    const existingPosts = await getUserPosts();
    const updatedPosts = existingPosts.filter(post => post.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

export async function updateUserPost(id: string, updatedArticle: Article): Promise<void> {
  try {
    const existingPosts = await getUserPosts();
    const updatedPosts = existingPosts.map(post =>
      post.id === id ? updatedArticle : post
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}
