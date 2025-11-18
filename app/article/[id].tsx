import { useLocalSearchParams, router } from 'expo-router';
import { ScrollView, StyleSheet, View, TouchableOpacity, Share, Platform } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import * as WebBrowser from 'expo-web-browser';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

export default function ArticleDetailScreen() {
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Parse the article data passed via route params
  const article = params.article ? JSON.parse(params.article as string) : null;

  if (!article) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Article not found</ThemedText>
      </ThemedView>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\n${article.description}\n\n${article.url || 'VecNews'}`,
        title: article.title,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleOpenOriginal = async () => {
    if (article.url) {
      await WebBrowser.openBrowserAsync(article.url);
    }
  };

  return (
    <LinearGradient
      colors={
        colorScheme === 'dark'
          ? ['#1a1a2e', '#16213e', '#0f3460']
          : ['#e8f5e9', '#f1f8e9', '#fff9c4']
      }
      style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <BlurView
            intensity={80}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            style={styles.buttonBlur}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color={colors.text} />
            </TouchableOpacity>
          </BlurView>
          <BlurView
            intensity={80}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            style={styles.buttonBlur}>
            <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
              <IconSymbol name="square.and.arrow.up" size={24} color={colors.text} />
            </TouchableOpacity>
          </BlurView>
        </Animated.View>

        {article.imageUrl && (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: article.imageUrl }} style={styles.headerImage} contentFit="cover" />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.imageGradient}
            />
          </View>
        )}

        <Animated.View entering={SlideInDown.duration(400).springify()} style={styles.content}>
          <ThemedText type="title" style={styles.title}>
            {article.title}
          </ThemedText>

          <View style={styles.meta}>
            <View style={[styles.authorDot, { backgroundColor: colors.tint }]} />
            <ThemedText style={styles.author}>{article.author}</ThemedText>
            <ThemedText style={styles.separator}>•</ThemedText>
            <ThemedText style={styles.date}>{formatDate(article.publishedAt)}</ThemedText>
          </View>

          {article.isUserCreated && (
            <LinearGradient
              colors={[colors.tint, `${colors.tint}CC`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.userBadge}>
              <ThemedText style={styles.userBadgeText}>✨ Your Post</ThemedText>
            </LinearGradient>
          )}

          <ThemedText type="defaultSemiBold" style={styles.description}>
            {article.description}
          </ThemedText>

          <ThemedText style={styles.body}>{article.content}</ThemedText>

          <View style={styles.divider} />

          <View style={styles.footer}>
            <ThemedText style={styles.source}>📰 {article.source}</ThemedText>
          </View>

          {article.url && !article.isUserCreated && (
            <TouchableOpacity onPress={handleOpenOriginal} activeOpacity={0.8}>
              <LinearGradient
                colors={[colors.tint, `${colors.tint}DD`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.readMoreButton}>
                <ThemedText style={styles.readMoreText}>Read Original Article</ThemedText>
                <IconSymbol name="arrow.right" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          )}
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  buttonBlur: {
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 350,
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  content: {
    padding: 24,
    paddingTop: 28,
  },
  title: {
    fontSize: 32,
    lineHeight: 40,
    marginBottom: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  authorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  author: {
    fontSize: 15,
    fontWeight: '700',
    opacity: 0.9,
  },
  separator: {
    marginHorizontal: 10,
    opacity: 0.5,
    fontSize: 15,
  },
  date: {
    fontSize: 14,
    opacity: 0.6,
    fontWeight: '500',
  },
  userBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  userBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
  },
  description: {
    fontSize: 20,
    lineHeight: 30,
    marginBottom: 24,
    opacity: 0.9,
    fontWeight: '600',
  },
  body: {
    fontSize: 17,
    lineHeight: 28,
    marginBottom: 32,
    opacity: 0.85,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    marginVertical: 20,
  },
  footer: {
    marginBottom: 24,
  },
  source: {
    fontSize: 15,
    fontWeight: '700',
    opacity: 0.8,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 16,
    gap: 10,
    marginTop: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  readMoreText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
  },
});
