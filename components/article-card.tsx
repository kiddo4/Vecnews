import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Article } from '@/types/article';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ArticleCardProps {
  article: Article;
  onPress: () => void;
}

export function ArticleCard({ article, onPress }: ArticleCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <Animated.View entering={FadeInDown.duration(400).springify()}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={styles.touchable}>
        <ThemedView
          style={[
            styles.card,
            {
              backgroundColor: colorScheme === 'dark' ? 'rgba(30, 30, 30, 0.6)' : 'rgba(255, 255, 255, 0.9)',
              borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
            },
          ]}>
          {article.imageUrl && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: article.imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={300}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.imageGradient}
              />
            </View>
          )}
          <View style={styles.content}>
            <ThemedText type="subtitle" numberOfLines={2} style={styles.title}>
              {article.title}
            </ThemedText>
            <ThemedText numberOfLines={3} style={styles.description}>
              {article.description}
            </ThemedText>
            <View style={styles.footer}>
              <View style={styles.sourceContainer}>
                <View style={[styles.sourceDot, { backgroundColor: colors.tint }]} />
                <ThemedText style={styles.source}>{article.source}</ThemedText>
              </View>
              <ThemedText style={styles.date}>{formatDate(article.publishedAt)}</ThemedText>
            </View>
            {article.isUserCreated && (
              <LinearGradient
                colors={[colors.tint, `${colors.tint}CC`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.badge}>
                <ThemedText style={styles.badgeText}>✨ Your Post</ThemedText>
              </LinearGradient>
            )}
          </View>
        </ThemedView>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginBottom: 4,
  },
  card: {
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: 'hidden',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 220,
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  content: {
    padding: 20,
  },
  title: {
    marginBottom: 10,
    lineHeight: 26,
    fontSize: 18,
    fontWeight: '700',
  },
  description: {
    marginBottom: 16,
    opacity: 0.7,
    lineHeight: 22,
    fontSize: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sourceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  source: {
    fontSize: 13,
    fontWeight: '700',
    opacity: 0.9,
  },
  date: {
    fontSize: 12,
    opacity: 0.5,
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
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
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
});
