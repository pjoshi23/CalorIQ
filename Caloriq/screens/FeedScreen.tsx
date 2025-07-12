import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Bell, Users, Sparkles } from 'lucide-react-native';
import FeedPostCard from '../components/FeedPostCard';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

interface FeedScreenProps {
  navigation: any;
}

export default function FeedScreen({ navigation }: FeedScreenProps) {
  const [refreshing, setRefreshing] = useState(false);
  const { getFeedPosts, likePost, userProfile } = useAuth();
  
  // Get real posts from followed users
  const feedPosts = getFeedPosts();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLike = async (postId: string) => {
    try {
      await likePost(postId);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = (postId: string) => {
    // Navigate to comments screen
    console.log('Opening comments for post:', postId);
  };

  const handleUserPress = (userId: string) => {
    // Navigate to user profile
    console.log('Opening profile for user:', userId);
  };

  const handleDiscoverPress = () => {
    navigation.navigate('Discover');
  };

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
              <Text style={styles.headerTitle}>Feed</Text>
              <Text style={styles.headerSubtitle}>Discover amazing meals</Text>
            </View>
            <View style={styles.headerIconsRow}>
              <TouchableOpacity style={styles.headerIcon} onPress={handleDiscoverPress}>
                <Users size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <Search size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <Bell size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.flex}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {feedPosts.length > 0 ? (
          <>
            {/* Feed Posts */}
            <View style={styles.postsContainer}>
              {feedPosts.map((post) => (
                <FeedPostCard
                  key={post.id}
                  post={post}
                  onLike={() => handleLike(post.id)}
                  onComment={() => handleComment(post.id)}
                  onUserPress={() => handleUserPress(post.userProfile.id)}
                />
              ))}
            </View>
            {/* Load More */}
            <View style={styles.loadMoreContainer}>
              <TouchableOpacity style={styles.loadMoreButton}>
                <Sparkles size={16} color="#10B981" />
                <Text style={styles.loadMoreText}>Load More Posts</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <Users size={48} color="#D1D5DB" />
            </View>
            <Text style={styles.emptyStateTitle}>No Posts Yet</Text>
            <Text style={styles.emptyStateText}>
              Follow some users to see their amazing meals here!
            </Text>
            <TouchableOpacity 
              style={styles.discoverButton}
              onPress={handleDiscoverPress}
            >
              <Users size={20} color="white" />
              <Text style={styles.discoverButtonText}>Discover People</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  flex: { 
    flex: 1 
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
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
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
  headerIconsRow: { 
    flexDirection: 'row', 
    gap: 16 
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postsContainer: {
    paddingTop: 16,
  },
  loadMoreContainer: { 
    alignItems: 'center', 
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  loadMoreButton: { 
    backgroundColor: 'white',
    paddingHorizontal: 24, 
    paddingVertical: 16, 
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  loadMoreText: { 
    color: '#10B981', 
    fontWeight: '600',
    fontSize: 16,
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  discoverButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#10B981',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  discoverButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});