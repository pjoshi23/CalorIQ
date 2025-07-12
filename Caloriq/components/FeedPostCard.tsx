import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MessageCircle, Share, MoreHorizontal, Clock } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { Post } from '../context/AuthContext';

interface FeedPostCardProps {
  post: Post;
  onLike: () => void;
  onComment: () => void;
  onUserPress: () => void;
}

export default function FeedPostCard({ post, onLike, onComment, onUserPress }: FeedPostCardProps) {
  const { user } = useAuth();
  
  // Check if current user has liked this post
  const isLiked = user ? post.likes.includes(user.uid) : false;
  
  // Format timestamp
  const formatTimestamp = (timestamp: any) => {
    const now = new Date();
    const postDate = timestamp.toDate();
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerUser} onPress={onUserPress}>
          <Image
            source={{ uri: post.userProfile.profilePicture }}
            style={styles.profilePic}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {post.userProfile.displayName}
            </Text>
            <View style={styles.timestampContainer}>
              <Clock size={12} color="#9CA3AF" />
              <Text style={styles.timestamp}>
                {formatTimestamp(post.createdAt)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Food Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: post.image }}
          style={styles.foodImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay}>
          <View style={styles.caloriesBadge}>
            <Text style={styles.caloriesBadgeText}>{post.nutrition.calories} cal</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsRow}>
        <View style={styles.actionsLeft}>
          <TouchableOpacity style={styles.actionButton} onPress={onLike}>
            <Heart 
              size={24} 
              color={isLiked ? "#EF4444" : "#374151"}
              fill={isLiked ? "#EF4444" : "none"}
            />
            <Text style={[styles.actionText, { color: isLiked ? "#EF4444" : "#6B7280" }]}>
              {post.likes.length}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onComment}>
            <MessageCircle size={24} color="#374151" />
            <Text style={styles.actionText}>{post.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Food Name & Nutrition */}
      <View style={styles.foodNameRow}>
        <Text style={styles.foodNameText}>
          {post.foodName}
        </Text>
        <View style={styles.nutritionBox}>
          <View style={styles.nutritionRow}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionCalories}>{post.nutrition.calories}</Text>
              <Text style={styles.nutritionLabel}>calories</Text>
            </View>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionProtein}>{post.nutrition.protein}g</Text>
              <Text style={styles.nutritionLabel}>protein</Text>
            </View>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionCarbs}>{post.nutrition.carbs}g</Text>
              <Text style={styles.nutritionLabel}>carbs</Text>
            </View>
            <View style={styles.nutritionDivider} />
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionFat}>{post.nutrition.fat}g</Text>
              <Text style={styles.nutritionLabel}>fat</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Caption */}
      <View style={styles.captionRow}>
        <Text style={styles.captionText}>
          <Text style={styles.captionUser}>{post.userProfile.displayName} </Text>
          {post.caption}
        </Text>
      </View>

      {/* Comments */}
      {post.comments > 0 && (
        <TouchableOpacity style={styles.commentsRow} onPress={onComment}>
          <Text style={styles.commentsText}>
            View all {post.comments} comments
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerUser: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: '600',
    color: '#111827',
    fontSize: 16,
    marginBottom: 2,
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  foodImage: {
    width: '100%',
    height: 320,
  },
  imageOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  caloriesBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  caloriesBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  actionsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  foodNameRow: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  foodNameText: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    fontSize: 18,
  },
  nutritionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionCalories: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 2,
  },
  nutritionProtein: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 2,
  },
  nutritionCarbs: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    marginBottom: 2,
  },
  nutritionFat: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A21CAF',
    marginBottom: 2,
  },
  nutritionLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  nutritionDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E7EB',
  },
  captionRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  captionText: {
    color: '#111827',
    fontSize: 14,
    lineHeight: 20,
  },
  captionUser: {
    fontWeight: '600',
  },
  commentsRow: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  commentsText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
});