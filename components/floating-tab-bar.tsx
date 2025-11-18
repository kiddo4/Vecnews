import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from './themed-text';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { BlurView } from 'expo-blur';

export function FloatingTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const renderTab = (route: any, index: number) => {
    const { options } = descriptors[route.key];
    const label = options.tabBarLabel ?? options.title ?? route.name;
    const isFocused = state.index === index;
    const isCreateTab = route.name === 'explore';

    const onPress = () => {
      const event = navigation.emit({
        type: 'tabPress',
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: 'tabLongPress',
        target: route.key,
      });
    };

    const iconName =
      route.name === 'index'
        ? 'newspaper.fill'
        : route.name === 'search'
        ? 'magnifyingglass'
        : 'plus';

    // Special styling for Create button in the middle
    if (isCreateTab) {
      return (
        <TouchableOpacity
          key={route.key}
          accessibilityRole="button"
          accessibilityState={isFocused ? { selected: true } : {}}
          onPress={onPress}
          onLongPress={onLongPress}
          style={styles.createButton}
          activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.tint, `${colors.tint}DD`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.createGradient}>
            <IconSymbol name={iconName} size={26} color="#fff" weight="bold" />
          </LinearGradient>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={route.key}
        accessibilityRole="button"
        accessibilityState={isFocused ? { selected: true } : {}}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.tab}
        activeOpacity={0.7}>
        <IconSymbol
          name={iconName}
          size={22}
          color={isFocused ? colors.tint : colors.icon}
          weight={isFocused ? 'semibold' : 'regular'}
        />
        <ThemedText
          style={[
            styles.label,
            {
              color: isFocused ? colors.tint : colors.icon,
              fontWeight: isFocused ? '700' : '500',
            },
          ]}>
          {String(label)}
        </ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <BlurView
        intensity={90}
        tint={colorScheme === 'dark' ? 'dark' : 'light'}
        style={[
          styles.tabBar,
          {
            backgroundColor: colorScheme === 'dark' ? 'rgba(20, 20, 20, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          },
        ]}>
        {state.routes.map((route, index) => renderTab(route, index))}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    right: 24,
    alignItems: 'center',
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
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 0.5,
    overflow: 'hidden',
    maxWidth: 380,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 2,
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
  createButton: {
    marginHorizontal: 8,
    marginTop: -24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  createGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
