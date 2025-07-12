import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Plus, Filter, TrendingUp, Target, Zap } from 'lucide-react-native';
import ProgressRing from '../components/ProgressRing';
import LoggedMealCard from '../components/LoggedMealCard';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

interface LogScreenProps {
  navigation: any;
}

export default function LogScreen({ navigation }: LogScreenProps) {
  const [selectedDate, setSelectedDate] = useState(new Date().toDateString());
  const { getTodayMeals, removeMeal, getWeekMeals } = useAuth();
  
  // Get real meal data
  const loggedMeals = getTodayMeals();
  
  // Get week meals data
  const weekMeals = getWeekMeals();
  
  // Calculate daily totals from logged meals
  const dailyTotals = loggedMeals.reduce((totals, meal) => ({
    calories: totals.calories + meal.calories,
    protein: totals.protein + meal.protein,
    carbs: totals.carbs + meal.carbs,
    fat: totals.fat + meal.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const dailyData = {
    calories: { current: dailyTotals.calories, target: 2000 },
    protein: { current: dailyTotals.protein, target: 120 },
    carbs: { current: dailyTotals.carbs, target: 250 },
    fat: { current: dailyTotals.fat, target: 65 },
  };

  const handleDeleteMeal = (mealId: string) => {
    Alert.alert(
      'Delete Meal',
      'Are you sure you want to remove this meal from your log?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMeal(mealId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete meal. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleEditMeal = (mealId: string) => {
    // Navigate to edit meal screen
    console.log('Editing meal:', mealId);
  };

  const calorieProgress = dailyData.calories.current / dailyData.calories.target;
  const proteinProgress = dailyData.protein.current / dailyData.protein.target;
  const carbsProgress = dailyData.carbs.current / dailyData.carbs.target;
  const fatProgress = dailyData.fat.current / dailyData.fat.target;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with gradient background */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>Food Log</Text>
              <Text style={styles.headerSubtitle}>
                Track your daily nutrition
              </Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIcon}>
                <Calendar size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <Filter size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Quick Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Target size={20} color="#10B981" />
            </View>
            <Text style={styles.statValue}>{dailyData.calories.current}</Text>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statTarget}>/ {dailyData.calories.target}</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <TrendingUp size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{loggedMeals.length}</Text>
            <Text style={styles.statLabel}>Meals</Text>
            <Text style={styles.statTarget}>Today</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Zap size={20} color="#DC2626" />
            </View>
            <Text style={styles.statValue}>{Math.round(calorieProgress * 100)}%</Text>
            <Text style={styles.statLabel}>Progress</Text>
            <Text style={styles.statTarget}>Daily Goal</Text>
          </View>
        </View>

        {/* Daily Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Daily Summary
            </Text>
            <View style={styles.progressIndicator}>
              <View style={[styles.progressDot, { backgroundColor: calorieProgress >= 1 ? '#10B981' : '#E5E7EB' }]} />
              <View style={[styles.progressDot, { backgroundColor: proteinProgress >= 1 ? '#DC2626' : '#E5E7EB' }]} />
              <View style={[styles.progressDot, { backgroundColor: carbsProgress >= 1 ? '#F59E0B' : '#E5E7EB' }]} />
              <View style={[styles.progressDot, { backgroundColor: fatProgress >= 1 ? '#A21CAF' : '#E5E7EB' }]} />
            </View>
          </View>
          
          <View style={styles.summaryCard}>
            {/* Main Calories Ring */}
            <View style={styles.caloriesRow}>
              <View style={styles.caloriesProgressItem}>
                <ProgressRing
                  progress={calorieProgress}
                  size={120}
                  strokeWidth={10}
                  color="#10B981"
                />
                <View style={styles.caloriesProgressText}>
                  <Text style={styles.caloriesProgressValue}>
                    {dailyData.calories.current}
                  </Text>
                  <Text style={styles.caloriesProgressLabel}>
                    of {dailyData.calories.target} cal
                  </Text>
                </View>
              </View>
            </View>

            {/* Macro Rings */}
            <View style={styles.macrosRow}>
              <View style={styles.macroProgressItem}>
                <View style={styles.macroProgressRingContainer}>
                  <ProgressRing
                    progress={proteinProgress}
                    size={70}
                    strokeWidth={6}
                    color="#DC2626"
                  />
                  <View style={styles.macroProgressTextOverlay}>
                    <Text style={styles.macroProgressValue}>
                      {dailyData.protein.current}
                    </Text>
                    <Text style={styles.macroProgressLabel}>
                      Protein
                    </Text>
                  </View>
                </View>
                <Text style={styles.macroProgressTarget}>
                  {dailyData.protein.target}g goal
                </Text>
              </View>

              <View style={styles.macroProgressItem}>
                <View style={styles.macroProgressRingContainer}>
                  <ProgressRing
                    progress={carbsProgress}
                    size={70}
                    strokeWidth={6}
                    color="#F59E0B"
                  />
                  <View style={styles.macroProgressTextOverlay}>
                    <Text style={styles.macroProgressValue}>
                      {dailyData.carbs.current}
                    </Text>
                    <Text style={styles.macroProgressLabel}>
                      Carbs
                    </Text>
                  </View>
                </View>
                <Text style={styles.macroProgressTarget}>
                  {dailyData.carbs.target}g goal
                </Text>
              </View>

              <View style={styles.macroProgressItem}>
                <View style={styles.macroProgressRingContainer}>
                  <ProgressRing
                    progress={fatProgress}
                    size={70}
                    strokeWidth={6}
                    color="#A21CAF"
                  />
                  <View style={styles.macroProgressTextOverlay}>
                    <Text style={styles.macroProgressValue}>
                      {dailyData.fat.current}
                    </Text>
                    <Text style={styles.macroProgressLabel}>
                      Fat
                    </Text>
                  </View>
                </View>
                <Text style={styles.macroProgressTarget}>
                  {dailyData.fat.target}g goal
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('Scan')}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.addButtonGradient}
            >
              <Plus size={24} color="white" />
              <Text style={styles.addButtonText}>Add Meal</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Meals List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Today's Meals ({loggedMeals.length})
            </Text>
          </View>

          {loggedMeals.length > 0 ? (
            loggedMeals.map((meal) => (
              <LoggedMealCard
                key={meal.id}
                meal={meal}
                onDelete={() => handleDeleteMeal(meal.id)}
                onEdit={() => handleEditMeal(meal.id)}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Plus size={48} color="#D1D5DB" />
              </View>
              <Text style={styles.emptyStateTitle}>No meals logged today</Text>
              <Text style={styles.emptyStateText}>
                Start by adding your first meal!
              </Text>
            </View>
          )}
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            This Week
          </Text>
          
          <View style={styles.weeklyContainer}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              // Get the date for this day of the week
              const now = new Date();
              const startOfWeek = new Date(now);
              const dayOfWeek = now.getDay();
              const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
              startOfWeek.setDate(now.getDate() - daysToSubtract);
              startOfWeek.setHours(0, 0, 0, 0);
              
              const dayDate = new Date(startOfWeek);
              dayDate.setDate(startOfWeek.getDate() + index);
              const dateString = dayDate.toISOString().split('T')[0];
              
              // Check if there are meals for this day
              const hasMeals = weekMeals[dateString] && weekMeals[dateString].length > 0;
              
              return (
                <View key={day} style={styles.weeklyItem}>
                  <Text style={styles.weeklyItemLabel}>{day}</Text>
                  <View style={[styles.weeklyItemCircle, { backgroundColor: hasMeals ? '#10B981' : '#E5E7EB' }]} />
                </View>
              );
            })}
          </View>
          
          <Text style={styles.weeklySubtitle}>
            {Object.values(weekMeals).filter(meals => meals.length > 0).length} of 7 days logged this week
          </Text>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: { 
    paddingHorizontal: 24,
  },
  headerContent: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  headerLeft: { 
    flex: 1 
  },
  headerTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: { 
    color: 'rgba(255, 255, 255, 0.9)', 
    fontSize: 16,
  },
  headerRight: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  headerIcon: { 
    padding: 8,
    marginLeft: 8,
  },
  scrollView: { 
    flex: 1,
    marginTop: -20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statTarget: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  quickActions: { 
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  addButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  addButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: 'white',
    marginLeft: 8,
  },
  section: { 
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#111827' 
  },
  progressIndicator: {
    flexDirection: 'row',
    gap: 4,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  caloriesRow: { 
    alignItems: 'center', 
    marginBottom: 32 
  },
  caloriesProgressItem: { 
    alignItems: 'center' 
  },
  caloriesProgressText: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  caloriesProgressValue: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#111827' 
  },
  caloriesProgressLabel: { 
    fontSize: 14, 
    color: '#6B7280',
    marginTop: 2,
  },
  macrosRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center' 
  },
  macroProgressItem: { 
    alignItems: 'center' 
  },
  macroProgressRingContainer: { 
    alignItems: 'center', 
    marginBottom: 8 
  },
  macroProgressTextOverlay: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  macroProgressValue: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#111827' 
  },
  macroProgressLabel: { 
    fontSize: 12, 
    color: '#6B7280', 
    marginTop: 2 
  },
  macroProgressTarget: { 
    fontSize: 11, 
    color: '#9CA3AF', 
    textAlign: 'center' 
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'white',
    borderRadius: 16,
    marginTop: 8,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  weeklyContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  weeklyItem: { 
    alignItems: 'center' 
  },
  weeklyItemLabel: { 
    fontSize: 12, 
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 8,
  },
  weeklyItemCircle: { 
    width: 24, 
    height: 24, 
    borderRadius: 12,
  },
  weeklySubtitle: { 
    fontSize: 14, 
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
  footer: { 
    height: 80 
  },
});