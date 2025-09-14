import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Copy, ThumbsDown, ThumbsUp } from 'lucide-react-native';
import React, { useEffect } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isStreaming?: boolean;
}

interface ChatMessageProps {
  message: Message;
  isLast: boolean;
  previousMessage?: Message;
}

export function ChatMessage({
  message,
  isLast,
  previousMessage,
}: ChatMessageProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
    translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const shouldShowTimestamp = () => {
    if (!previousMessage) return true;
    const timeDiff =
      message.timestamp.getTime() - previousMessage.timestamp.getTime();
    return timeDiff > 5 * 60 * 1000; // 5 minutes
  };

  const copyToClipboard = async () => {
    try {
      await Clipboard.setStringAsync(message.content);
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to copy message');
    }
  };

  const handleLike = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Implement like logic here
  };

  const handleDislike = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Implement dislike logic here
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isUser = message.role === 'user';

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {shouldShowTimestamp() && (
        <Text style={styles.timestamp}>{formatTime(message.timestamp)}</Text>
      )}

      <View style={[styles.messageRow, isUser && styles.userMessageRow]}>
        <View
          style={[
            styles.messageBubble,
            isUser ? styles.userBubble : styles.assistantBubble,
          ]}
        >
          {message.role === 'assistant' ? (
            <Markdown style={markdownStyles}>{message.content}</Markdown>
          ) : (
            <Text
              style={[styles.messageText, isUser && styles.userMessageText]}
            >
              {message.content}
            </Text>
          )}

          {message.isStreaming && <View style={styles.cursor} />}
        </View>
      </View>

      {!isUser && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <ThumbsUp size={16} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDislike}>
            <ThumbsDown size={16} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={copyToClipboard}
          >
            <Copy size={16} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginVertical: 16,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  userAvatar: {
    backgroundColor: '#F2F2F2',
    marginRight: 0,
    marginLeft: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  userAvatarText: {
    fontSize: 8,
    color: '#000',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  assistantBubble: {
    backgroundColor: '#F2F2F2',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    backgroundColor: '#F2F2F2',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000',
  },
  userMessageText: {
    color: '#000',
  },
  cursor: {
    width: 2,
    height: 16,
    backgroundColor: '#007AFF',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginLeft: 40,
    marginTop: 4,
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
  },
});

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 22,
    color: '#1D1D1F',
  },
  code_inline: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  code_block: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  fence: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
