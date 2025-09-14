import { useThemeColor } from '@/hooks/useThemeColor';
import * as Haptics from 'expo-haptics';
import { ArrowUp, AudioLines, Mic, Plus } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ComposerProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export function Composer({ onSendMessage, disabled = false }: ComposerProps) {
  const [message, setMessage] = useState('');
  const [containerHeight, setContainerHeight] = useState(44);
  const textInputRef = useRef<TextInput>(null);

  const textColor = useThemeColor({}, 'text');
  const accentBackground = useThemeColor({}, 'accentBackground');
  const backgroundColor = useThemeColor({}, 'background');
  const iconColor = useThemeColor({}, 'icon');
  const grayColor = useThemeColor({}, 'gray');

  const minHeight = 44;
  const maxHeight = 120; // 6 lines * 20 lineHeight

  const handleSend = () => {
    if (message.trim() && !disabled) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      onSendMessage(message.trim());
      setMessage('');
      setContainerHeight(minHeight);
    }
  };

  const handleAttach = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    // Implement attachment logic here
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    // Calculate new height, capping it between minHeight and maxHeight
    const newHeight = Math.max(minHeight, Math.min(maxHeight, height + 20));
    setContainerHeight(newHeight);
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={['bottom']}
    >
      <View style={styles.inputContainer}>
        <TouchableOpacity
          style={[styles.attachButton, disabled && styles.disabledButton]}
          onPress={handleAttach}
          disabled={disabled}
        >
          <Plus size={20} color={disabled ? '#C7C7CC' : '#8E8E93'} />
        </TouchableOpacity>

        <View
          style={[
            styles.textInputContainer,
            {
              backgroundColor: accentBackground,
            },
          ]}
        >
          <TextInput
            ref={textInputRef}
            style={[
              styles.textInput,
              {
                color: textColor,
              },
            ]}
            value={message}
            onChangeText={setMessage}
            onContentSizeChange={handleContentSizeChange}
            placeholder="Ask anything"
            placeholderTextColor="#8E8E93"
            multiline={true}
            textAlignVertical="top"
            maxLength={2000}
            editable={!disabled}
            returnKeyType="default"
            blurOnSubmit={false}
            scrollEnabled={containerHeight >= maxHeight}
            {...Platform.select({
              web: {
                style: {
                  outline: 'none',
                  resize: 'none',
                },
              },
            })}
          />
          <View style={styles.sendButtonsContainer}>
            <TouchableOpacity style={[styles.sendButton]}>
              <Mic size={16} color={iconColor} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.streamingButton]}
              onPress={handleSend}
              disabled={!canSend}
            >
              {!canSend ? (
                <AudioLines size={16} color={'#fff'} />
              ) : (
                <ArrowUp size={16} color={'#fff'} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  attachButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginBottom: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  textInputContainer: {
    flex: 1,
    borderWidth: 0,
    borderColor: '#E5E5E7',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    minHeight: 44,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
    paddingVertical: 0, // Ensure no extra padding is added here
    ...Platform.select({
      ios: {
        paddingTop: 0,
        paddingBottom: 0,
      },
      android: {
        paddingTop: 0,
        paddingBottom: 0,
        textAlignVertical: 'top',
      },
      web: {
        outlineWidth: 0,
        resize: 'none',
        fontFamily: 'inherit',
      },
    }),
  },
  sendButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    marginLeft: 8,
    paddingBottom: 2,
  },
  sendButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streamingButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
});
