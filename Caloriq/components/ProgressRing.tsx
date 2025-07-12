import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface ProgressRingProps {
  progress: number; // 0 to 1
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor?: string;
  showGradient?: boolean;
}

export default function ProgressRing({
  progress,
  size,
  strokeWidth,
  color,
  backgroundColor = '#F3F4F6',
  showGradient = false,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - progress * circumference;

  // Create gradient colors based on the main color
  const getGradientColors = (baseColor: string) => {
    switch (baseColor) {
      case '#10B981': // Green
        return ['#10B981', '#059669'];
      case '#DC2626': // Red
        return ['#DC2626', '#B91C1C'];
      case '#F59E0B': // Orange
        return ['#F59E0B', '#D97706'];
      case '#A21CAF': // Purple
        return ['#A21CAF', '#7C3AED'];
      default:
        return [baseColor, baseColor];
    }
  };

  const gradientColors = getGradientColors(color);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </LinearGradient>
        </Defs>
        
        {/* Background circle */}
        <Circle
          stroke={backgroundColor}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeOpacity={0.3}
        />
        
        {/* Progress circle */}
        <Circle
          stroke={showGradient ? "url(#progressGradient)" : color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeOpacity={0.9}
        />
      </Svg>
    </View>
  );
}