import { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import { saveUserPost } from '@/services/storage';
import { Article } from '@/types/article';

export default function CreatePostScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !content.trim()) {
      Alert.alert('Missing Fields', 'Please fill in title, description, and content.');
      return;
    }

    setIsSubmitting(true);

    try {
      const newArticle: Article = {
        id: `user-post-${Date.now()}`,
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        author: author.trim() || 'Anonymous',
        publishedAt: new Date().toISOString(),
        imageUrl: imageUrl.trim() || undefined,
        source: 'VecNews',
        isUserCreated: true,
      };

      await saveUserPost(newArticle);

      Alert.alert('Success', 'Your post has been published!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setTitle('');
            setDescription('');
            setContent('');
            setAuthor('');
            setImageUrl('');
            // Navigate to home to see the new post
            router.push('/(tabs)');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to publish your post. Please try again.');
      console.error('Error saving post:', error);
    } finally {
      setIsSubmitting(false);
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
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <ThemedText type="title" style={styles.headerTitle}>
                Create Post
              </ThemedText>
              <ThemedText style={styles.subtitle}>Share your story</ThemedText>
            </View>

            <View style={styles.form}>
            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Title</ThemedText>
              <BlurView
                intensity={30}
                tint={colorScheme === 'dark' ? 'dark' : 'light'}
                style={styles.inputBlur}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="What's your story about?"
                  placeholderTextColor={`${colors.text}50`}
                  value={title}
                  onChangeText={setTitle}
                  maxLength={200}
                />
              </BlurView>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Author</ThemedText>
              <BlurView
                intensity={30}
                tint={colorScheme === 'dark' ? 'dark' : 'light'}
                style={styles.inputBlur}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Your name"
                  placeholderTextColor={`${colors.text}50`}
                  value={author}
                  onChangeText={setAuthor}
                  maxLength={100}
                />
              </BlurView>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Summary</ThemedText>
              <BlurView
                intensity={30}
                tint={colorScheme === 'dark' ? 'dark' : 'light'}
                style={styles.inputBlur}>
                <TextInput
                  style={[styles.input, styles.textArea, { color: colors.text }]}
                  placeholder="A brief summary..."
                  placeholderTextColor={`${colors.text}50`}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={3}
                  maxLength={300}
                />
              </BlurView>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Story</ThemedText>
              <BlurView
                intensity={30}
                tint={colorScheme === 'dark' ? 'dark' : 'light'}
                style={styles.inputBlur}>
                <TextInput
                  style={[styles.input, styles.contentArea, { color: colors.text }]}
                  placeholder="Write your story..."
                  placeholderTextColor={`${colors.text}50`}
                  value={content}
                  onChangeText={setContent}
                  multiline
                  numberOfLines={10}
                  textAlignVertical="top"
                />
              </BlurView>
            </View>

            <View style={styles.inputContainer}>
              <ThemedText style={styles.label}>Cover Image URL</ThemedText>
              <BlurView
                intensity={30}
                tint={colorScheme === 'dark' ? 'dark' : 'light'}
                style={styles.inputBlur}>
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="https://..."
                  placeholderTextColor={`${colors.text}50`}
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </BlurView>
            </View>

            <TouchableOpacity
              style={[styles.submitButtonContainer, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
              activeOpacity={0.8}>
              <LinearGradient
                colors={[colors.tint, `${colors.tint}DD`]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.submitButton}>
                <ThemedText style={styles.submitButtonText}>
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </ThemedText>
              </LinearGradient>
            </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    opacity: 0.7,
    fontWeight: '400',
  },
  form: {
    padding: 20,
    paddingTop: 0,
  },
  inputContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.9,
  },
  inputBlur: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  input: {
    padding: 16,
    fontSize: 15,
    fontWeight: '400',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  contentArea: {
    minHeight: 180,
    textAlignVertical: 'top',
  },
  submitButtonContainer: {
    marginTop: 24,
    borderRadius: 14,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  submitButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
