// Enhanced Help/Concierge screen with safety-focused design
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { Theme } from '../../constants/theme';
import { TAB_BAR_OVERLAY_HEIGHT } from '../../constants/layout';
import Screen from '../../components/ui/Screen';
import Card from '../../components/ui/Card';

type Message = {
  id: number;
  text: string;
  sender: 'assistant' | 'user';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
};

const replyLibrary = [
  {
    keywords: ['cafe', 'café', 'coffee', 'safe place'],
    response: 'Safe Café Collective on Janpath stays open till midnight and has vetted cab bays outside. Would you like directions?',
  },
  {
    keywords: ['night', 'area safe', 'dark', 'unsafe'],
    response: 'For your safety at night, stick to well-lit main roads. Avoid service lanes after 11pm. Delhi Police patrols every 20 minutes in tourist areas.',
  },
  {
    keywords: ['number', 'emergency', 'contact', 'police'],
    response: 'Key Emergency Numbers:\n• 112 - Universal Emergency\n• 100 - Police\n• 108 - Ambulance\n• 1091 - Women Safety\n• 1363 - Tourist Helpline (bilingual)',
  },
  {
    keywords: ['hospital', 'doctor', 'medical', 'sick'],
    response: 'Nearest hospitals with English-speaking staff:\n• RML Hospital (1.8 km) - Emergency: 011-23365555\n• Max Hospital (3.2 km)\n• Apollo (4.1 km)',
  },
  {
    keywords: ['taxi', 'cab', 'uber', 'transport'],
    response: 'For safe transport, use only:\n• Uber/Ola (verified drivers)\n• Metro (6am-11pm)\n• Pre-paid taxi from official counters\nAvoid unmarked vehicles.',
  },
];

const quickActions = [
  {
    id: 'emergency',
    title: 'Emergency Numbers',
    icon: 'call-outline',
    preset: 'Show me emergency contact numbers',
  },
  {
    id: 'safe-place',
    title: 'Find Safe Place',
    icon: 'location-outline',
    preset: 'Find me a safe place nearby',
  },
  {
    id: 'transport',
    title: 'Safe Transport',
    icon: 'car-outline',
    preset: 'How do I find safe transport?',
  },
  {
    id: 'medical',
    title: 'Medical Help',
    icon: 'medkit-outline',
    preset: 'I need medical help',
  },
];

const supportServices = [
  {
    id: 'concierge',
    title: 'Live Concierge',
    description: '24/7 bilingual support for any situation',
    icon: 'headset-outline',
    available: true,
  },
  {
    id: 'escort',
    title: 'Safety Escort',
    description: 'Request a verified local escort',
    icon: 'walk-outline',
    available: true,
  },
  {
    id: 'translation',
    title: 'Translation Help',
    description: 'Real-time language assistance',
    icon: 'language-outline',
    available: true,
  },
];

const createTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const HelpScreen = () => {
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 1,
      text: 'Hello! I\'m your safety concierge. How can I help you stay safe in India today?',
      sender: 'assistant',
      timestamp: createTimestamp(),
      status: 'read',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const quickReplies = [
    'Is this area safe at night?',
    'Find safe café nearby',
    'Emergency numbers',
    'I feel unsafe',
    'Need a taxi',
  ];

  const getResponse = (text: string) => {
    const lower = text.toLowerCase();
    const template = replyLibrary.find((item) => item.keywords.some((keyword) => lower.includes(keyword)));
    if (template) return template.response;
    
    if (lower.includes('unsafe') || lower.includes('scared') || lower.includes('help')) {
      return 'I understand you\'re feeling unsafe. Here\'s what you can do:\n\n1. Move to a well-lit, crowded area\n2. Call 112 for emergency\n3. Share your live location with trusted contacts\n4. Use the SOS button in the app\n\nWould you like me to connect you with local support?';
    }
    
    return "I'm here to help you stay safe. You can ask about:\n• Safe places nearby\n• Emergency contacts\n• Transport options\n• Medical help\n\nOr tap one of the quick action buttons above.";
  };

  const handleSend = (preset?: string) => {
    const payload = (preset ?? inputText).trim();
    if (!payload) return;

    const userMessage: Message = {
      id: Date.now(),
      text: payload,
      sender: 'user',
      timestamp: createTimestamp(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    const replyText = getResponse(payload);
    setTimeout(() => {
      setMessages((prev) => {
        const updated = prev.map((message) =>
          message.id === userMessage.id ? { ...message, status: 'read' as const } : message
        );
        return [
          ...updated,
          { id: Date.now() + 1, text: replyText, sender: 'assistant' as const, timestamp: createTimestamp(), status: 'read' as const },
        ];
      });
      setIsTyping(false);
    }, 800);
  };

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
      >
        {/* Header */}
        <LinearGradient colors={[Theme.colors.primary, Theme.colors.primaryDark]} style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerAvatar}>
              <Ionicons name="shield-checkmark" size={28} color={Theme.colors.white} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerTitle}>Safety Concierge</Text>
              <View style={styles.headerStatus}>
                <View style={styles.onlineDot} />
                <Text style={styles.headerStatusText}>Online • 24/7 Support</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            ref={scrollRef}
            style={styles.messagesScroll}
            contentContainerStyle={styles.messagesContent}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          >
            {/* Quick Actions */}
            <View style={styles.quickActionsSection}>
              <Text style={styles.quickActionsTitle}>Quick Help</Text>
              <View style={styles.quickActionsGrid}>
                {quickActions.map((action) => (
                  <TouchableOpacity
                    key={action.id}
                    style={styles.quickActionCard}
                    onPress={() => handleSend(action.preset)}
                  >
                    <View style={styles.quickActionIcon}>
                      <Ionicons name={action.icon as any} size={22} color={Theme.colors.primary} />
                    </View>
                    <Text style={styles.quickActionTitle}>{action.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Support Services */}
            <View style={styles.servicesSection}>
              <Text style={styles.servicesTitle}>Support Services</Text>
              {supportServices.map((service) => (
                <TouchableOpacity key={service.id} style={styles.serviceRow}>
                  <View style={styles.serviceIcon}>
                    <Ionicons name={service.icon as any} size={20} color={Theme.colors.primary} />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.serviceDesc}>{service.description}</Text>
                  </View>
                  <View style={[styles.availableBadge, !service.available && styles.unavailableBadge]}>
                    <Text style={[styles.availableText, !service.available && styles.unavailableText]}>
                      {service.available ? 'Available' : 'Busy'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Messages */}
            <View style={styles.messagesSection}>
              <Text style={styles.messagesTitle}>Conversation</Text>
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <View
                    key={msg.id}
                    style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}
                  >
                    {!isUser && (
                      <View style={styles.assistantIcon}>
                        <Ionicons name="shield-checkmark" size={16} color={Theme.colors.primary} />
                      </View>
                    )}
                    <View style={[styles.messageContent, isUser && styles.userMessageContent]}>
                      <Text style={[styles.messageText, isUser && styles.userMessageText]}>{msg.text}</Text>
                      <View style={styles.messageMeta}>
                        <Text style={[styles.messageTime, isUser && styles.userMessageTime]}>
                          {msg.timestamp}
                        </Text>
                        {isUser && (
                          <Ionicons
                            name={msg.status === 'read' ? 'checkmark-done' : 'checkmark'}
                            size={14}
                            color={msg.status === 'read' ? Theme.colors.primary : Theme.colors.subtleText}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
              {isTyping && (
                <View style={[styles.messageBubble, styles.assistantBubble]}>
                  <View style={styles.assistantIcon}>
                    <Ionicons name="shield-checkmark" size={16} color={Theme.colors.primary} />
                  </View>
                  <View style={styles.messageContent}>
                    <View style={styles.typingDots}>
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                      <View style={styles.dot} />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRepliesScroll}
          >
            {quickReplies.map((reply, index) => (
              <TouchableOpacity key={index} style={styles.quickReply} onPress={() => handleSend(reply)}>
                <Text style={styles.quickReplyText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.inputRow}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Type your message..."
                placeholderTextColor={Theme.colors.subtleText}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => handleSend()}
                multiline
              />
            </View>
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={() => handleSend()}
              disabled={!inputText.trim()}
            >
              <Ionicons name="send" size={20} color={Theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: TAB_BAR_OVERLAY_HEIGHT }} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  headerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Theme.font.size.lg,
    fontWeight: '700',
    color: Theme.colors.white,
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.success,
  },
  headerStatusText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: Theme.font.size.sm,
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: Theme.spacing.md,
    gap: Theme.spacing.lg,
  },
  quickActionsSection: {
    gap: Theme.spacing.sm,
  },
  quickActionsTitle: {
    fontWeight: '700',
    color: Theme.colors.text,
    fontSize: Theme.font.size.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  quickActionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    alignItems: 'center',
    gap: Theme.spacing.xs,
    ...Theme.shadows.sm,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionTitle: {
    fontWeight: '600',
    color: Theme.colors.text,
    fontSize: Theme.font.size.sm,
    textAlign: 'center',
  },
  servicesSection: {
    gap: Theme.spacing.sm,
  },
  servicesTitle: {
    fontWeight: '700',
    color: Theme.colors.text,
    fontSize: Theme.font.size.md,
  },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    gap: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontWeight: '600',
    color: Theme.colors.text,
  },
  serviceDesc: {
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  availableBadge: {
    backgroundColor: Theme.colors.successBg,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
  },
  unavailableBadge: {
    backgroundColor: Theme.colors.warningBg,
  },
  availableText: {
    color: Theme.colors.success,
    fontSize: Theme.font.size.xs,
    fontWeight: '600',
  },
  unavailableText: {
    color: Theme.colors.warning,
  },
  messagesSection: {
    gap: Theme.spacing.sm,
  },
  messagesTitle: {
    fontWeight: '700',
    color: Theme.colors.text,
    fontSize: Theme.font.size.md,
  },
  messageBubble: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  userBubble: {
    justifyContent: 'flex-end',
  },
  assistantBubble: {
    justifyContent: 'flex-start',
  },
  assistantIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(30, 64, 175, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContent: {
    maxWidth: '75%',
    backgroundColor: Theme.colors.card,
    padding: Theme.spacing.md,
    borderRadius: Theme.radius.lg,
    borderTopLeftRadius: Theme.radius.xs,
    ...Theme.shadows.sm,
  },
  userMessageContent: {
    backgroundColor: Theme.colors.primary,
    borderTopLeftRadius: Theme.radius.lg,
    borderTopRightRadius: Theme.radius.xs,
  },
  messageText: {
    color: Theme.colors.text,
    lineHeight: 20,
  },
  userMessageText: {
    color: Theme.colors.white,
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  messageTime: {
    fontSize: Theme.font.size.xs,
    color: Theme.colors.subtleText,
  },
  userMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  typingDots: {
    flexDirection: 'row',
    gap: 4,
    padding: Theme.spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Theme.colors.subtleText,
  },
  inputContainer: {
    backgroundColor: Theme.colors.card,
    paddingTop: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.border,
  },
  quickRepliesScroll: {
    paddingBottom: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  quickReply: {
    backgroundColor: Theme.colors.backgroundSecondary,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.full,
    marginRight: Theme.spacing.sm,
  },
  quickReplyText: {
    color: Theme.colors.text,
    fontSize: Theme.font.size.sm,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Theme.spacing.sm,
    paddingBottom: Theme.spacing.sm,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: Theme.colors.backgroundSecondary,
    borderRadius: Theme.radius.lg,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    maxHeight: 100,
  },
  textInput: {
    color: Theme.colors.text,
    fontSize: Theme.font.size.md,
    maxHeight: 80,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Theme.colors.lightGray,
  },
});

export default HelpScreen;
