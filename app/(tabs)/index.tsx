import { ChatHeader } from '@/components/ui/ChatHeader';
import { ChatMessage } from '@/components/ui/ChatMessage';
import { Composer } from '@/components/ui/Composer';
import { MessageSuggestions } from '@/components/ui/MessageSuggestions';
import { TypingIndicator } from '@/components/ui/TypingIndicator';
import { useChat } from '@ai-sdk/react';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

// Definisanje predloga poruka
const suggestions = [
  'Objasni mi kvantnu fiziku',
  'Napiši pesmu o prirodi',
  'Pomozi mi sa kodom',
  'Daj mi recepte za ručak',
];

export default function ChatScreen() {
  const { messages, sendMessage, status, setMessages, error } = useChat();
  console.log('messages', messages);
  console.log('status', status);
  console.log('error', error);
  const flatListRef = useRef<FlatList>(null);
  const [userHasScrolled, setUserHasScrolled] = useState(false);

  const isStreaming = status === 'streaming';

  useEffect(() => {
    if (isStreaming && !userHasScrolled && messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, isStreaming, userHasScrolled]);

  const handleScroll = (event: any) => {
    const { contentOffset } = event.nativeEvent;
    const { contentSize, layoutMeasurement } = event.nativeEvent;
    const isNearBottom =
      contentOffset.y + layoutMeasurement.height >= contentSize.height - 100;
    setUserHasScrolled(!isNearBottom);
  };

  const handleSuggestionPress = (suggestion: string) => {
    sendMessage({
      text: suggestion,
    });
  };

  const handleMenuPress = () => {
    // Implement menu logic here
    console.log('Menu pressed');
  };

  const handleNewChatPress = () => {
    setMessages([]);
    console.log('New chat pressed');
  };

  const handleMorePress = () => {
    // Implement more options logic here
    console.log('More options pressed');
  };

  const handleSendMessage = (message: string) => {
    sendMessage({
      text: message,
    });
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const reversedIndex = messages.length - 1 - index;

    // Extract text content from UIMessage parts
    const textParts =
      item.parts?.filter((part: any) => part.type === 'text') || [];
    const content = textParts.map((part: any) => part.text).join('');

    const message = {
      id: item.id,
      content: content,
      role: item.role as 'user' | 'assistant',
      timestamp: new Date(),
      isStreaming: false,
    };

    const previousMessage = messages[reversedIndex + 1]
      ? {
          id: messages[reversedIndex + 1].id,
          content:
            messages[reversedIndex + 1].parts
              ?.filter((part: any) => part.type === 'text')
              .map((part: any) => part.text)
              .join('') || '',
          role: messages[reversedIndex + 1].role as 'user' | 'assistant',
          timestamp: new Date(),
          isStreaming: false,
        }
      : undefined;

    return (
      <ChatMessage
        message={message}
        isLast={reversedIndex === messages.length - 1}
        previousMessage={previousMessage}
      />
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>How can I help you today?</Text>
      <MessageSuggestions
        suggestions={suggestions}
        onSuggestionPress={handleSuggestionPress}
        disabled={isStreaming}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ChatHeader
        onMenuPress={handleMenuPress}
        onNewChatPress={handleNewChatPress}
        onMorePress={handleMorePress}
      />

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <FlatList
          ref={flatListRef}
          data={[...messages].reverse()}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.messagesContainer,
            messages.length === 0 && styles.messagesContainerEmpty,
          ]}
          ListEmptyComponent={renderEmptyState}
        />

        {isStreaming && (
          <View style={styles.typingContainer}>
            <TypingIndicator />
          </View>
        )}

        <Composer onSendMessage={handleSendMessage} disabled={isStreaming} />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messagesContainerEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 32,
    textAlign: 'center',
  },
  typingContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
