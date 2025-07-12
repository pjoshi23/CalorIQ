import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TrendingUp, Target, Zap, Flame } from 'lucide-react-native';

interface MacroCardProps {
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  type: 'calories' | 'protein' | 'carbs' | 'fat';
}

const BAR_WIDTH = 120; // px

export default function MacroCard({
  name,
  current,
  target,
  unit,
  color,
  type,
}: MacroCardProps) {
  const progress = current / target;
  const percentage = Math.round(progress * 100);
  const fillWidth = (Math.min(percentage, 100) / 100) * BAR_WIDTH;

  const getIcon = () => {
    switch (type) {
      case 'calories':
        return <Flame size={20} color={color} />;
      case 'protein':
        return <Target size={20} color={color} />;
      case 'carbs':
        return <TrendingUp size={20} color={color} />;
      case 'fat':
        return <Zap size={20} color={color} />;
      default:
        return <Target size={20} color={color} />;
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          {getIcon()}
        </View>
        <View style={styles.headerText}>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.unitText}>{unit}</Text>
        </View>
      </View>
      
      <View style={styles.progressSection}>
        <View style={styles.valueRow}>
          <Text style={[styles.currentValue, { color }]}>
            {current}
          </Text>
          <Text style={styles.targetValue}>
            / {target}
          </Text>
        </View>
        
        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBarBg, { width: BAR_WIDTH }]}> 
            <View
              style={[
                styles.progressBarFill,
                { backgroundColor: color, width: fillWidth },
              ]}
            />
          </View>
          <Text style={[styles.percentText, { color }]}>
            {percentage}%
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    flex: 1,
    marginHorizontal: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  unitText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressSection: {
    alignItems: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  currentValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  targetValue: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressBarBg: {
    backgroundColor: '#F3F4F6',
    borderRadius: 999,
    height: 8,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 999,
  },
  percentText: {
    fontSize: 14,
    fontWeight: '600',
  },
});