import React from 'react';
import { View, StyleSheet, ViewStyle, ScrollView, StyleProp } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../constants/theme';

type ScreenProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  scrollable?: boolean;
  footerInset?: number;
};

const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  contentStyle,
  scrollable = true,
  footerInset = 0,
}) => {
  const insets = useSafeAreaInsets();

  if (scrollable) {
    return (
      <View style={[styles.container, style]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top, paddingBottom: footerInset + insets.bottom },
            contentStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.content,
          { paddingTop: insets.top, paddingBottom: footerInset + insets.bottom },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: Theme.spacing.md,
    gap: Theme.spacing.md,
  },
});

export default Screen;
