// UI Revamp - Updated Collapsible component to use direct theme styling.
import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native'; // UI Revamp - Use standard View and Text

import { IconSymbol } from './icon-symbol';
import { Theme } from '../../constants/theme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.container}> {/* UI Revamp - Replaced ThemedView with View */}
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={Theme.colors.subtleText} // UI Revamp - Use subtleText color
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <Text style={styles.titleText}>{title}</Text> {/* UI Revamp - Replaced ThemedText with Text */}
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>} {/* UI Revamp - Replaced ThemedView with View */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background, // UI Revamp - Apply background color directly
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  titleText: {
    fontSize: Theme.font.size.md, // UI Revamp - Apply font size
    fontFamily: Theme.font.family.sansBold, // UI Revamp - Apply font family
    color: Theme.colors.text, // UI Revamp - Apply text color
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
