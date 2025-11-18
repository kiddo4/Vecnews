import { useState, useEffect } from 'react';
import { FlatList, StyleSheet, RefreshControl, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ArticleCard } from '@/components/article-card';
import { Article } from '@/types/article';
import { fetchTopHeadlines } from '@/services/newsApi';
import { getUserPosts } from '@/services/storage';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const loadArticles = async () => {
    try {
      const [newsArticles, userPosts] = await Promise.all([
        fetchTopHeadlines(),
        getUserPosts(),
      ]);

      // Combine user posts and news articles
      const combined = [...userPosts, ...newsArticles];
      setArticles(combined);
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadArticles();
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

  if (loading) {
    return (
      <LinearGradient
        colors={
          colorScheme === 'dark'
            ? ['#1a1a2e', '#16213e', '#0f3460']
            : ['#e8f5e9', '#f1f8e9', '#fff9c4']
        }
        style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <ThemedText style={styles.loadingText}>Loading news...</ThemedText>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={
        colorScheme === 'dark'
          ? ['#1a1a2e', '#16213e', '#0f3460']
          : ['#e8f5e9', '#f1f8e9', '#fff9c4']
      }
      style={styles.container}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <ArticleCard article={item} onPress={() => handleArticlePress(item)} />
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <ThemedText type="title" style={styles.headerTitle}>
                  VecNews
                </ThemedText>
                <View style={[styles.titleUnderline, { backgroundColor: colors.tint }]} />
              </View>
            </View>
            <ThemedText style={styles.headerSubtitle}>
              📰 Latest News & Stories
            </ThemedText>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No articles available</ThemedText>
            <ThemedText style={styles.emptySubtext}>Pull down to refresh</ThemedText>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.tint}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    opacity: 0.7,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
  },
  titleUnderline: {
    height: 4,
    width: 60,
    marginTop: 8,
    borderRadius: 2,
  },
  headerSubtitle: {
    fontSize: 17,
    opacity: 0.8,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 120,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.6,
  },
});
