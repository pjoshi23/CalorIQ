import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Grid, List, Users, Award, Camera, TrendingUp, Target, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const imageSize = (width - 48) / 3 - 4;

interface ProfileScreenProps {
  navigation: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const { user, userProfile, loggedMeals, posts } = useAuth();

  // Get user's posts (shared meals)
  const userPosts = posts.filter(post => post.userId === user?.uid);

  // Empty array for achievements
  const achievements: any[] = [];

  if (!userProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with gradient background */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>Your nutrition journey</Text>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.profileInfoRow}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: userProfile.profilePicture }}
                style={styles.profilePicture}
              />
              <View style={styles.onlineIndicator} />
            </View>
            <View style={styles.profileInfoText}>
              <Text style={styles.profileName}>
                {userProfile.displayName}
              </Text>
              <Text style={styles.profileUsername}>
                @{userProfile.username}
              </Text>
              <Text style={styles.profileBio}>
                Nutrition enthusiast • Fitness lover
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Camera size={20} color="#10B981" />
              </View>
              <Text style={styles.statValue}>
                {userPosts.length}
              </Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <Users size={20} color="#F59E0B" />
              </View>
              <Text style={styles.statValue}>
                {userProfile.followers.length.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.statIconContainer}>
                <TrendingUp size={20} color="#DC2626" />
              </View>
              <Text style={styles.statValue}>
                {userProfile.following.length}
              </Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>
                Edit Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonSecondary}>
              <Text style={styles.actionButtonSecondaryText}>
                Share Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsContainer}>
          <View style={styles.achievementsHeader}>
            <View style={styles.achievementsIconContainer}>
              <Award size={20} color="#F59E0B" />
            </View>
            <Text style={styles.achievementsTitle}>
              Achievements
            </Text>
          </View>
          
          {achievements.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {achievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementItem,
                    {
                      backgroundColor: achievement.earned ? '#FFFBEB' : '#F3F4F6',
                      borderColor: achievement.earned ? '#FDE68A' : '#E5E7EB',
                    },
                  ]}
                >
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <Text style={[
                    styles.achievementName,
                    {
                      color: achievement.earned ? '#F59E0B' : '#6B7280',
                    },
                  ]}>
                    {achievement.name}
                  </Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyStateIcon}>
                <Award size={48} color="#D1D5DB" />
              </View>
              <Text style={styles.emptyStateTitle}>No Achievements Yet</Text>
              <Text style={styles.emptyStateText}>
                Start logging meals to earn achievements!
              </Text>
            </View>
          )}
        </View>

        {/* Content Section - Posts (Grid) or Meals (List) */}
        <View style={styles.contentSection}>
          <View style={styles.contentHeader}>
            <Text style={styles.contentTitle}>
              {viewMode === 'grid' ? 'My Posts' : 'All Meals'}
            </Text>
            <View style={styles.contentToggle}>
              <TouchableOpacity
                style={[
                  styles.contentToggleButton,
                  {
                    backgroundColor: viewMode === 'grid' ? '#FFFFFF' : '#F3F4F6',
                  },
                ]}
                onPress={() => setViewMode('grid')}
              >
                <Grid size={16} color={viewMode === 'grid' ? '#374151' : '#9CA3AF'} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.contentToggleButton,
                  {
                    backgroundColor: viewMode === 'list' ? '#FFFFFF' : '#F3F4F6',
                  },
                ]}
                onPress={() => setViewMode('list')}
              >
                <List size={16} color={viewMode === 'list' ? '#374151' : '#9CA3AF'} />
              </TouchableOpacity>
            </View>
          </View>

          {viewMode === 'grid' ? (
            // Grid View - Shows Posts (Shared Meals)
            userPosts.length > 0 ? (
              <View style={styles.gridPosts}>
                {userPosts.map((post) => (
                  <TouchableOpacity
                    key={post.id}
                    style={[
                      styles.gridPost,
                      {
                        width: imageSize,
                        height: imageSize,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: post.image }}
                      style={styles.gridPostImage}
                      resizeMode="cover"
                    />
                    <View style={styles.gridPostOverlay}>
                      <Text style={styles.gridPostCalories}>
                        {post.nutrition.calories} cal
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIcon}>
                  <Camera size={48} color="#D1D5DB" />
                </View>
                <Text style={styles.emptyStateTitle}>No Posts Yet</Text>
                <Text style={styles.emptyStateText}>
                  Share your meals to see them here!
                </Text>
              </View>
            )
          ) : (
            // List View - Shows All Logged Meals
            loggedMeals.length > 0 ? (
              <View style={styles.listMeals}>
                {loggedMeals.map((meal) => (
                  <TouchableOpacity
                    key={meal.id}
                    style={styles.listMeal}
                  >
                    <Image
                      source={{ uri: meal.image }}
                      style={styles.listMealImage}
                      resizeMode="cover"
                    />
                    <View style={styles.listMealText}>
                      <Text style={styles.listMealName}>
                        {meal.name}
                      </Text>
                      <Text style={styles.listMealCalories}>
                        {meal.calories} calories
                      </Text>
                      <Text style={styles.listMealTime}>
                        {meal.time} • {meal.date}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIcon}>
                  <Target size={48} color="#D1D5DB" />
                </View>
                <Text style={styles.emptyStateTitle}>No Meals Yet</Text>
                <Text style={styles.emptyStateText}>
                  Start logging meals to see them here!
                </Text>
              </View>
            )
          )}
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    padding: 24,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  profileInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInfoText: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  profileBio: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E7EB',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  actionButtonSecondary: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionButtonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  achievementsContainer: {
    padding: 24,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  achievementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  achievementsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFBEB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  achievementItem: {
    marginRight: 12,
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 100,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementName: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  contentSection: {
    padding: 24,
    backgroundColor: 'white',
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  contentToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
  },
  contentToggleButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridPosts: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  gridPost: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  gridPostImage: {
    width: '100%',
    height: '100%',
  },
  gridPostOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  gridPostCalories: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  listMeals: {
    gap: 12,
  },
  listMeal: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  listMealImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  listMealText: {
    flex: 1,
  },
  listMealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  listMealCalories: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  listMealTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
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
  footer: {
    height: 80,
  },
});