// Conversational concierge with canned assistant replies and quick intents.
import { Ionicons } from '@expo/vector-icons';
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

type Message = {
  id: number;
  text: string;
  sender: 'assistant' | 'user';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
};

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

const helperCards = [
  {
    id: 'concierge',
    title: 'Concierge dial',
    description: 'Speak with a bilingual guide for vetted rides.',
    icon: 'call-outline',
    preset: 'Connect me to the concierge hotline.',
  },
  {
    id: 'escort',
    title: 'Request local escort',
    description: 'Field agent will meet you at a safe café.',
    icon: 'walk-outline',
    preset: 'I need a local escort near Connaught Place.',
  },
  {
    id: 'share',
    title: 'Share live itinerary',
    description: 'Send routes + ETA to trusted circle.',
    icon: 'navigate-circle-outline',
    preset: 'Share my current itinerary with trusted contacts.',
  },
  {
    id: 'volunteer',
    title: 'Volunteer network',
    description: 'Pair with vetted local volunteers.',
    icon: 'hand-left-outline',
    preset: 'Pair me with a volunteer buddy around me.',
  },
  {
    id: 'wellness',
    title: 'Wellness support',
    description: 'Talk to a counselor or helpline.',
    icon: 'heart-outline',
    preset: 'Connect me to a mental health helpline nearby.',
  },
];

const supportActions = [
  {
    id: 'volunteer',
    title: 'Volunteer escort',
    detail: 'Verified locals can walk you to your hotel.',
    icon: 'shield-checkmark-outline',
    preset: 'Request a vetted volunteer escort to my current location.',
  },
  {
    id: 'community',
    title: 'Community check-in',
    detail: 'Set 15-min safety pings with a buddy.',
    icon: 'people-outline',
    preset: 'Start community check-ins every 15 minutes tonight.',
  },
  {
    id: 'aid',
    title: 'Relief / shelter',
    detail: 'Ask for food, water, or a safe waiting spot.',
    icon: 'home-outline',
    preset: 'Find a safe waiting spot or shelter close by.',
  },
];

const createTimestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const HelpScreen = () => {
  const [messages, setMessages] = useState<Message[]>(() => [
    { id: 1, text: 'Hello! How can I help you today?', sender: 'assistant', timestamp: createTimestamp(), status: 'read' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const quickReplies = [
    'Nearest safe café',
    'Is this area safe at night?',
    'Show local emergency numbers',
    'I want to volunteer as a safety buddy',
    'Find me a female-led taxi',
    'Connect me to a counselor now',
  ];
  const assistantStatus = ['Concierge online', 'Avg reply 2m', 'Encrypted feed'];
  const chatPartner = { name: 'Aro Concierge', status: 'Online now' };

  const getResponse = (text: string) => {
    const lower = text.toLowerCase();
    const template = replyLibrary.find((item) => item.keywords.some((keyword) => lower.includes(keyword)));
    return template?.response ?? "I'm monitoring alerts and will nudge you if anything critical pops nearby.";
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
          message.id === userMessage.id ? { ...message, status: 'read' } : message
        );
        return [
          ...updated,
          { id: Date.now() + 1, text: replyText, sender: 'assistant', timestamp: createTimestamp(), status: 'read' },
        ];
      });
      setIsTyping(false);
    }, 600);
  };

  return (
    <Screen style={styles.screen} footerInset={TAB_BAR_OVERLAY_HEIGHT}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 40}
      >
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <View style={styles.headerLeft}>
              <View style={styles.headerAvatar}>
                <Text style={styles.headerAvatarText}>
                  {chatPartner.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={styles.headerTitle}>{chatPartner.name}</Text>
                <Text style={styles.headerSubtitle}>{chatPartner.status}</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <Ionicons name="videocam-outline" size={22} color={Theme.colors.white} />
              <Ionicons name="call-outline" size={22} color={Theme.colors.white} />
            </View>
          </View>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.messagesContainer}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            >
              <View style={styles.heroCard}>
                <View style={styles.heroBadge}>
                  <Ionicons name="chatbubble-ellipses-outline" size={18} color={Theme.colors.primary} />
                  <Text style={styles.heroBadgeText}>Concierge desk</Text>
                </View>
                <Text style={styles.heroTitle}>Need help on the move?</Text>
                <Text style={styles.heroSubtitle}>
                  Pick an action card or drop a message to your command center.
                </Text>
                <View style={styles.heroPills}>
                  {assistantStatus.map((pill) => (
                    <View key={pill} style={styles.heroPill}>
                      <Ionicons name="shield-checkmark-outline" size={14} color={Theme.colors.primary} />
                      <Text style={styles.heroPillText}>{pill}</Text>
                    </View>
                  ))}
                </View>
                <View style={styles.helperCardGrid}>
                  {helperCards.map((card) => (
                    <TouchableOpacity key={card.id} style={styles.helperCard} onPress={() => handleSend(card.preset)}>
                      <View style={styles.helperIcon}>
                        <Ionicons name={card.icon as any} size={18} color={Theme.colors.primary} />
                      </View>
                      <Text style={styles.helperTitle}>{card.title}</Text>
                      <Text style={styles.helperSubtitle}>{card.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.supportList}>
                  {supportActions.map((action) => (
                    <TouchableOpacity key={action.id} style={styles.supportRow} onPress={() => handleSend(action.preset)}>
                      <View style={styles.supportIcon}>
                        <Ionicons name={action.icon as any} size={16} color={Theme.colors.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.supportTitle}>{action.title}</Text>
                        <Text style={styles.supportDetail}>{action.detail}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={Theme.colors.subtleText} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                const statusIcon = msg.status === 'sent' ? 'checkmark' : 'checkmark-done';
                const statusColor = msg.status === 'read' ? '#34B7F1' : Theme.colors.subtleText;

                return (
                  <View key={msg.id} style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
                    <Text style={[styles.messageText, isUser && styles.messageTextUser]}>{msg.text}</Text>
                    <View style={styles.messageMetaRow}>
                      <Text style={[styles.messageTimestamp, isUser && styles.messageTimestampUser]}>
                        {msg.timestamp}
                      </Text>
                      {isUser && <Ionicons name={statusIcon as any} size={14} color={statusColor} />}
                    </View>
                  </View>
                );
              })}
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
          </TouchableWithoutFeedback>
        </View>

        <View style={styles.inputContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRepliesScroll}>
            {quickReplies.map((reply, index) => (
              <TouchableOpacity key={index} style={styles.quickReply} onPress={() => handleSend(reply)}>
                <Text style={styles.quickReplyText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.textInputRow}>
            <View style={styles.textInputShell}>
              <TouchableOpacity style={styles.inputIconButton}>
                <Ionicons name="happy-outline" size={20} color={Theme.colors.subtleText} />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                placeholder="Message"
                placeholderTextColor={Theme.colors.subtleText}
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={() => handleSend()}
              />
              <TouchableOpacity style={styles.inputIconButton}>
                <Ionicons name="attach-outline" size={20} color={Theme.colors.subtleText} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inputIconButton}>
                <Ionicons name="camera-outline" size={20} color={Theme.colors.subtleText} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => handleSend()} style={styles.micButton}>
              <Ionicons name={inputText ? 'send' : 'mic-outline'} size={20} color={Theme.colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#ece5dd',
    padding: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
    backgroundColor: '#075E54',
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.lg,
    paddingBottom: Theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAvatarText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
    fontSize: Theme.font.size.md,
  },
  headerTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.white,
  },
  headerSubtitle: {
    fontFamily: Theme.font.family.sans,
    color: 'rgba(255,255,255,0.8)',
    fontSize: Theme.font.size.xs,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
  },
  messagesContainer: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.lg,
    gap: Theme.spacing.md,
    backgroundColor: '#ece5dd',
  },
  heroCard: {
    backgroundColor: Theme.colors.card,
    borderRadius: Theme.radius.lg,
    padding: Theme.spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.06)',
    gap: Theme.spacing.sm,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(85,99,255,0.12)',
    alignSelf: 'flex-start',
  },
  heroBadgeText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
    fontSize: Theme.font.size.xs,
  },
  heroTitle: {
    fontFamily: Theme.font.family.sansBold,
    fontSize: Theme.font.size.lg,
    color: Theme.colors.text,
  },
  heroSubtitle: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
  },
  heroPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.sm,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.radius.full,
    backgroundColor: 'rgba(85,99,255,0.1)',
  },
  heroPillText: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.primary,
    fontSize: Theme.font.size.xs,
  },
  helperCardGrid: {
    flexDirection: 'row',
    gap: Theme.spacing.sm,
    flexWrap: 'wrap',
  },
  supportList: {
    marginTop: Theme.spacing.sm,
    gap: Theme.spacing.sm,
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
    padding: Theme.spacing.sm,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  supportIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(85,99,255,0.12)',
  },
  supportTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  supportDetail: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  helperCard: {
    flex: 1,
    minWidth: 140,
    borderRadius: Theme.radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background,
    gap: Theme.spacing.xs,
  },
  helperIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(85,99,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperTitle: {
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  helperSubtitle: {
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.subtleText,
    fontSize: Theme.font.size.sm,
  },
  messageBubble: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    maxWidth: '80%',
    borderRadius: Theme.radius.lg,
  },
  userBubble: {
    backgroundColor: '#d9fdd3',
    alignSelf: 'flex-end',
    borderTopRightRadius: Theme.radius.sm,
    borderTopLeftRadius: Theme.radius.lg,
  },
  assistantBubble: {
    backgroundColor: Theme.colors.white,
    alignSelf: 'flex-start',
    borderTopLeftRadius: Theme.radius.sm,
  },
  messageText: {
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
  },
  messageTextUser: {
    color: Theme.colors.text,
  },
  messageMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  messageTimestamp: {
    fontFamily: Theme.font.family.sans,
    fontSize: Theme.font.size.xs,
    color: Theme.colors.subtleText,
  },
  messageTimestampUser: {
    color: '#1c5c3c',
  },
  inputContainer: {
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.lightGray,
    backgroundColor: '#f7f7f7',
  },
  quickRepliesScroll: {
    marginBottom: Theme.spacing.md,
  },
  quickReply: {
    backgroundColor: Theme.colors.white,
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.radius.full,
    marginRight: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  quickReplyText: {
    fontSize: Theme.font.size.sm,
    fontFamily: Theme.font.family.sansBold,
    color: Theme.colors.text,
  },
  textInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.sm,
  },
  textInputShell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.radius.full,
    paddingHorizontal: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  inputIconButton: {
    padding: 4,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    fontSize: Theme.font.size.md,
    fontFamily: Theme.font.family.sans,
    color: Theme.colors.text,
  },
  micButton: {
    backgroundColor: Theme.colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
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
