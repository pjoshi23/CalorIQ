import React from 'react';
import { View, Text, Image, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Clock, MoreVertical, Edit, Trash2, Flame, Target, TrendingUp, Zap } from 'lucide-react-native';

interface LoggedMealCardProps {
  meal: {
    id: string;
    name: string;
    image: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    time: string;
    mealType: string;
  };
  onDelete: () => void;
  onEdit: () => void;
}

export default function LoggedMealCard({ meal, onDelete, onEdit }: LoggedMealCardProps) {
  const showOptions = () => {
    Alert.alert(
      'Meal Options',
      'What would you like to do?',
      [
        { text: 'Edit', onPress: onEdit },
        { text: 'Delete', onPress: onDelete, style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getMealTypeColor = (mealType: string) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return { bg: '#FEF3C7', text: '#D97706' };
      case 'lunch':
        return { bg: '#DBEAFE', text: '#2563EB' };
      case 'dinner':
        return { bg: '#FCE7F3', text: '#BE185D' };
      case 'snack':
        return { bg: '#D1FAE5', text: '#059669' };
      default:
        return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const mealTypeColors = getMealTypeColor(meal.mealType);

  return (
    <TouchableOpacity style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: meal.image }}
          style={styles.mealImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay}>
          <View style={[styles.mealTypeBadge, { backgroundColor: mealTypeColors.bg }]}>
            <Text style={[styles.mealTypeText, { color: mealTypeColors.text }]}>
              {meal.mealType}
            </Text>
          </View>
          <TouchableOpacity style={styles.optionsButton} onPress={showOptions}>
            <MoreVertical size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.mealName} numberOfLines={1}>
            {meal.name}
          </Text>
          <View style={styles.timeContainer}>
            <Clock size={12} color="#9CA3AF" />
            <Text style={styles.timeText}>
              {meal.time}
            </Text>
          </View>
        </View>

        {/* Calories */}
        <View style={styles.caloriesRow}>
          <View style={styles.caloriesIcon}>
            <Flame size={16} color="#10B981" />
          </View>
          <Text style={styles.caloriesText}>
            {meal.calories} calories
          </Text>
        </View>

        {/* Macros */}
        <View style={styles.macrosContainer}>
          <View style={styles.macroItem}>
            <View style={styles.macroIcon}>
              <Target size={12} color="#DC2626" />
            </View>
            <Text style={styles.macroValue}>{meal.protein}g</Text>
            <Text style={styles.macroLabel}>protein</Text>
          </View>
          
          <View style={styles.macroDivider} />
          
          <View style={styles.macroItem}>
            <View style={styles.macroIcon}>
              <TrendingUp size={12} color="#F59E0B" />
            </View>
            <Text style={styles.macroValue}>{meal.carbs}g</Text>
            <Text style={styles.macroLabel}>carbs</Text>
          </View>
          
          <View style={styles.macroDivider} />
          
          <View style={styles.macroItem}>
            <View style={styles.macroIcon}>
              <Zap size={12} color="#A21CAF" />
            </View>
            <Text style={styles.macroValue}>{meal.fat}g</Text>
            <Text style={styles.macroLabel}>fat</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  mealImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mealTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mealTypeText: {
    fontWeight: '600',
    fontSize: 12,
  },
  optionsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealName: {
    fontWeight: 'bold',
    color: '#111827',
    fontSize: 16,
    flex: 1,
    marginRight: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
    fontWeight: '500',
  },
  caloriesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  caloriesIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  caloriesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  macrosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  macroItem: {
    alignItems: 'center',
    flex: 1,
  },
  macroIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  macroDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E7EB',
  },
});