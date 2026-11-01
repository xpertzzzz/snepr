import React from 'react';
import { Text, StyleSheet, TextStyle, ColorValue } from 'react-native';

interface IconProps {
  name: string;
  size?: number;
  color?: ColorValue | string;
  style?: TextStyle;
}

const ICON_MAP: Record<string, string> = {
  'house.fill': '🏠',
  'house': '🏠',
  'magnifyingglass': '🔍',
  'search': '🔍',
  'clock.fill': '⏱️',
  'clock': '⏱️',
  'person.fill': '👤',
  'person': '👤',
  'arrow.clockwise': '🔄',
  'refresh': '🔄',
  'xmark.circle.fill': '✕',
  'cancel': '✕',
  'scissors': '✂️',
  'sparkles': '✨',
};

export function Icon({ name, size = 18, color, style }: IconProps) {
  const symbol = ICON_MAP[name] || '•';

  // For text-based glyphs like ✕, style with color
  if (symbol === '✕') {
    return (
      <Text style={[{ fontSize: size, color: color || '#666', fontWeight: '900', lineHeight: size + 2 }, style]}>
        {symbol}
      </Text>
    );
  }

  return (
    <Text style={[{ fontSize: size, lineHeight: size + 4 }, style]}>
      {symbol}
    </Text>
  );
}
