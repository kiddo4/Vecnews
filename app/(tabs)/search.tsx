import { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  FlatList,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ArticleCard } from '@/components/article-card';
import { Article, ArticleCategory } from '@/types/article';
import { searchNews, fetchTopHeadlines } from '@/services/newsApi';
import { getUserPosts } from '@/services/storage';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { IconSymbol } from '@/components/ui/icon-symbol';

const CATEGORIES: ArticleCategory[] = [
  'general',
  'technology',
  'business',
  'entertainment',
  'sports',
  'science',
  'health',
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | null>(null);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  useEffect(() => {
    loadArticles();
  }, [selectedCategory]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const [newsArticles, userPosts] = await Promise.all([
        selectedCategory ? fetchTopHeadlines(selectedCategory) : fetchTopHeadlines(),
        getUserPosts(),
      ]);

      const combined = [...userPosts, ...newsArticles];
      setArticles(combined);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadArticles();
      return;
    }

    setLoading(true);
    try {
      const [searchResults, userPosts] = await Promise.all([
        searchNews(searchQuery),
        getUserPosts(),
      ]);

      // Filter user posts by search query
      const filteredUserPosts = userPosts.filter(
        post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const combined = [...filteredUserPosts, ...searchResults];
      setArticles(combined);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArticlePress = (article: Article) => {
    router.push({
      pathname: '/article/[id]',
      params: {
        id: article.id,
        article: JSON.stringify(article),
      },
    });
  };

  const handleCategoryPress = (category: ArticleCategory) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setSearchQuery('');
  };

  return (
    <LinearGradient
      colors={
        colorScheme === 'dark'
          ? ['#1a1a2e', '#16213e', '#0f3460']
          : ['#e8f5e9', '#f1f8e9', '#fff9c4']
      }
      style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>
          🔍 Explore
        </ThemedText>

        <BlurView
          intensity={40}
          tint={colorScheme === 'dark' ? 'dark' : 'light'}
          style={[
            styles.searchContainer,
            {
              backgroundColor: colorScheme === 'dark' ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            },
          ]}>
          <IconSymbol name="magnifyingglass" size={20} color={colors.tint} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search articles..."
            placeholderTextColor={`${colors.text}80`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                loadArticles();
              }}>
              <IconSymbol name="xmark.circle.fill" size={20} color={colors.icon} />
            </TouchableOpacity>
          )}
        </BlurView>

        <View style={styles.categoriesContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryChip,
                  selectedCategory === item && styles.categoryChipActive,
                ]}
                onPress={() => handleCategoryPress(item)}>
                <LinearGradient
                  colors={
                    selectedCategory === item
                      ? [colors.tint, `${colors.tint}DD`]
                      : ['transparent', 'transparent']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.categoryGradient}>
                  <ThemedText
                    style={[
                      styles.categoryText,
                      {
                        color: selectedCategory === item ? '#fff' : colors.tint,
                      },
                    ]}>
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </ThemedText>
                </LinearGradient>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.categoriesList}
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
        </View>
      ) : (
        <FlatList
          data={articles}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <ArticleCard article={item} onPress={() => handleArticlePress(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol name="newspaper" size={64} color={colors.icon} />
              <ThemedText style={styles.emptyText}>
                {searchQuery
                  ? 'No articles found'
                  : selectedCategory
                  ? `No ${selectedCategory} articles`
                  : 'Start searching for articles'}
              </ThemedText>
            </View>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: -1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    marginBottom: 20,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  categoriesContainer: {
    marginTop: 4,
  },
  categoriesList: {
    gap: 10,
  },
  categoryChip: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  categoryChipActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 120,
  },
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    opacity: 0.6,
    textAlign: 'center',
  },
});
