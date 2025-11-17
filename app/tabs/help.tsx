// Conversational concierge with canned assistant replies and quick intents.
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Theme } from '../../constants/theme';
import Screen from '../../components/ui/Screen';

const replyLibrary = [
  {
    keywords: ['cafe', 'café', 'coffee'],
    response: 'Safe Café Collective on Janpath stays open till midnight and has vetted cab bays outside.',
  },
  {
    keywords: ['night', 'area safe', 'dark'],
    response: 'Stick to the lit boulevard and avoid the service lane after 11pm. Patrol cars loop every 20 min.',
  },
  {
    keywords: ['number', 'emergency', 'contact'],
    response: 'Dial 112 for emergencies, 1091 for women safety, and 1363 for the bilingual tourist desk.',
  },
];

const HelpScreen = () => {
  const [messages, setMessages] = useState([{ id: 1, text: 'Hello! How can I help you today?', sender: 'assistant' as const }]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = ['Nearest safe café', 'Is this area safe at night?', 'Show local emergency numbers'];

  const getResponse = (text: string) => {
    const lower = text.toLowerCase();
    const template = replyLibrary.find((item) => item.keywords.some((keyword) => lower.includes(keyword)));
    return template?.response ?? "I'm monitoring alerts and will nudge you if anything critical pops nearby.";
  };

  const handleSend = (preset?: string) => {
    const payload = (preset ?? inputText).trim();
    if (!payload) return;

    setMessages((prev) => [...prev, { id: Date.now(), text: payload, sender: 'user' as const }]);
    setInputText('');
    setIsTyping(true);

    const replyText = getResponse(payload);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now() + 1, text: replyText, sender: 'assistant' as const }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <Screen style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView contentContainerStyle={styles.messagesContainer}>
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[styles.messageBubble, msg.sender === 'user' ? styles.userBubble : styles.assistantBubble]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
            </View>
          ))}
          {isTyping && (
            <View style={[styles.messageBubble, styles.assistantBubble]}>
              <View style={styles.typingDots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRepliesScroll}>
            {quickReplies.map((reply, index) => (
              <TouchableOpacity key={index} style={styles.quickReply} onPress={() => handleSend(reply)}>
                <Text style={styles.quickReplyText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask anything: routes, safety, help..."
              placeholderTextColor={Theme.colors.subtleText}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity onPress={() => handleSend()} style={styles.sendButton}>
              <Ionicons name="send" size={24} color={Theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.colors.background,
    padding: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.lg,
  },
  messageBubble: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    maxWidth: '80%',
    ...Theme.shadows.sm,
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    borderTopLeftRadius: Theme.radius.lg,
    borderTopRightRadius: Theme.radius.sm,
    borderBottomLeftRadius: Theme.radius.lg,
    borderBottomRightRadius: Theme.radius.lg,
  },
  assistantBubble: {
    backgroundColor: Theme.colors.card,
    alignSelf: 'flex-start',
    borderTopLeftRadius: Theme.radius.sm,
    borderTopRightRadius: Theme.radius.lg,
    borderBottomLeftRadius: Theme.radius.lg,
    borderBottomRightRadius: Theme.radius.lg,
  },
  messageText: {
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
  },
  inputContainer: {
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.lightGray,
    backgroundColor: Theme.colors.white,
  },
  quickRepliesScroll: {
    marginBottom: Theme.spacing.md,
  },
  quickReply: {
    backgroundColor: Theme.colors.lightGray,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.full,
    marginRight: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.mediumGray,
  },
  quickReplyText: {
    fontSize: Theme.font.size.sm,
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    backgroundColor: Theme.colors.lightGray,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
  },
  sendButton: {
    backgroundColor: Theme.colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.subtleText,
  },
});

export default HelpScreen;
