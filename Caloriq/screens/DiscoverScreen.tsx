import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, UserPlus, UserCheck, ArrowLeft, Users, Sparkles } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

interface DiscoverScreenProps {
  navigation: any;
}

export default function DiscoverScreen({ navigation }: DiscoverScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { allUsers, userProfile, followUser, unfollowUser } = useAuth();

  // Filter users based on search query
  const filteredUsers = allUsers.filter(user => 
    user.id !== userProfile?.id && // Don't show current user
    (user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.username.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleFollow = async (userId: string) => {
    try {
      await followUser(userId);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async (userId: string) => {
    try {
      await unfollowUser(userId);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  const isFollowing = (userId: string) => {
    return userProfile?.following.includes(userId) || false;
  };

  const handleUserPress = (userId: string) => {
    // Navigate to user profile (could be implemented later)
    console.log('Opening profile for user:', userId);
  };

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
            <Text style={styles.headerTitle}>Discover People</Text>
            <Text style={styles.headerSubtitle}>Find amazing food lovers</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>
      </LinearGradient>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredUsers.length > 0 ? (
          <>
            {/* Results Header */}
            <View style={styles.resultsHeader}>
              <Text style={styles.resultsTitle}>
                {filteredUsers.length} {filteredUsers.length === 1 ? 'person' : 'people'} found
              </Text>
            </View>
            
            {/* User Cards */}
            <View style={styles.usersContainer}>
              {filteredUsers.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={styles.userCard}
                  onPress={() => handleUserPress(user.id)}
                >
                  <Image
                    source={{ uri: user.profilePicture }}
                    style={styles.userAvatar}
                  />
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.displayName}</Text>
                    <Text style={styles.userUsername}>@{user.username}</Text>
                    <View style={styles.userStats}>
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user.posts}</Text>
                        <Text style={styles.statLabel}>posts</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statItem}>
                        <Text style={styles.statValue}>{user.followers.length}</Text>
                        <Text style={styles.statLabel}>followers</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      isFollowing(user.id) && styles.followingButton,
                    ]}
                    onPress={() => 
                      isFollowing(user.id) 
                        ? handleUnfollow(user.id) 
                        : handleFollow(user.id)
                    }
                  >
                    {isFollowing(user.id) ? (
                      <>
                        <UserCheck size={16} color="#10B981" />
                        <Text style={styles.followingText}>Following</Text>
                      </>
                    ) : (
                      <>
                        <UserPlus size={16} color="white" />
                        <Text style={styles.followText}>Follow</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              {searchQuery ? (
                <Search size={48} color="#D1D5DB" />
              ) : (
                <Users size={48} color="#D1D5DB" />
              )}
            </View>
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'No users found' : 'No users available'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Check back later to discover new users!'
              }
            </Text>
            {!searchQuery && (
              <View style={styles.emptyStateAction}>
                <Sparkles size={16} color="#10B981" />
                <Text style={styles.emptyStateActionText}>More users coming soon!</Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  headerSpacer: {
    width: 44,
  },
  searchContainer: {
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  resultsHeader: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  usersContainer: {
    paddingHorizontal: 24,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  userUsername: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#E5E7EB',
    marginRight: 16,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  followingButton: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  followText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  followingText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  emptyStateIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyStateAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  emptyStateActionText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
}); 