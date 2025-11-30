import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '../../constants/theme';

export default function ProgressBar({ progress = 0, color }: { progress?: number; color?: string }) {
  const pct = Math.max(0, Math.min(1, progress));
  const barColor = color || (pct < 0.5 ? Theme.colors.warning : pct < 1 ? Theme.colors.primary : Theme.colors.success);
  
  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: barColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { 
    flex: 1,
    height: 8, 
    backgroundColor: Theme.colors.lightGray, 
    borderRadius: 4, 
    overflow: 'hidden' 
  },
  fill: { 
    height: '100%', 
    borderRadius: 4,
  },
});
