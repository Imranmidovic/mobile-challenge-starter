import { useThemeColor } from '@/hooks/useThemeColor';
import { Menu } from '@/icons/Menu';
import * as Haptics from 'expo-haptics';
import { ChevronRight, Ellipsis, SquarePen } from 'lucide-react-native';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ChatHeaderProps {
  onMenuPress?: () => void;
  onNewChatPress?: () => void;
  onMorePress?: () => void;
}

export function ChatHeader({
  onMenuPress,
  onNewChatPress,
  onMorePress,
}: ChatHeaderProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const grayColor = useThemeColor({}, 'gray');

  const handleMenuPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onMenuPress?.();
  };

  const handleNewChatPress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onNewChatPress?.();
  };

  const handleMorePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onMorePress?.();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.iconButton} onPress={handleMenuPress}>
            <Menu size={24} color={textColor} />
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <Text style={styles.title}>
              ChatGPT <Text style={styles.version}>5</Text>
            </Text>
            <ChevronRight size={24} color={grayColor} />
          </View>
        </View>
        <View style={styles.rightActions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleNewChatPress}
          >
            <SquarePen size={24} color={textColor} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleMorePress}>
            <Ellipsis size={24} color={textColor} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0,
    borderBottomColor: '#E5E5E7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    height: 56,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  version: {
    color: '#8E8E93',
  },
});
