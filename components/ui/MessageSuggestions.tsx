import * as Haptics from 'expo-haptics';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface MessageSuggestionsProps {
  suggestions: string[];
  onSuggestionPress: (suggestion: string) => void;
  disabled?: boolean;
}

export function MessageSuggestions({
  suggestions,
  onSuggestionPress,
  disabled = false,
}: MessageSuggestionsProps) {
  const handleSuggestionPress = (suggestion: string) => {
    if (!disabled) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onSuggestionPress(suggestion);
    }
  };

  return (
    <View style={styles.container}>
      {suggestions.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.suggestion, disabled && styles.suggestionDisabled]}
          onPress={() => handleSuggestionPress(suggestion)}
          disabled={disabled}
        >
          <Text
            style={[
              styles.suggestionText,
              disabled && styles.suggestionTextDisabled,
            ]}
          >
            {suggestion}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  suggestion: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  suggestionDisabled: {
    opacity: 0.5,
  },
  suggestionText: {
    fontSize: 16,
    color: '#1D1D1F',
    textAlign: 'center',
  },
  suggestionTextDisabled: {
    color: '#8E8E93',
  },
});
