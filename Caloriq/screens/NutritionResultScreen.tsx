import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { X, Plus, Share } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import * as FileSystem from 'expo-file-system';
import { analyzeFoodImage } from '../services/gemini';

interface NutritionResultScreenProps {
  navigation: any;
  route: any;
}

export default function NutritionResultScreen({ route, navigation }: NutritionResultScreenProps) {
  const { imageUri, fromCamera } = route.params;
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [nutritionData, setNutritionData] = useState<any>(null);
  const [caption, setCaption] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const { addMeal, createPost } = useAuth();

  useEffect(() => {
    const analyzeImage = async () => {
      setIsAnalyzing(true);
      try {
        // Convert image to base64
        const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: FileSystem.EncodingType.Base64 });
        // Analyze with Gemini
        const result = await analyzeFoodImage(base64);
        setNutritionData(result);
      } catch (error) {
        Alert.alert('Error', 'Failed to analyze image.');
      }
      setIsAnalyzing(false);
    };
    analyzeImage();
  }, [imageUri]);

  const handleAddToLog = async () => {
    if (!nutritionData) return;
    setIsLogging(true);
    try {
      await addMeal({
        name: nutritionData.name || 'Unknown Food',
        image: imageUri,
        calories: Number(nutritionData.calories) || 0,
        protein: Number(nutritionData.protein) || 0,
        carbs: Number(nutritionData.carbs) || 0,
        fat: Number(nutritionData.fat) || 0,
        mealType: 'Meal',
      });
      setIsLogging(false);
      Alert.alert('Success', 'Meal added to your log!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setIsLogging(false);
      Alert.alert('Error', 'Failed to add meal to log. Please try again.');
    }
  };

  const handlePostToFeed = async () => {
    if (!nutritionData) return;
    setIsPosting(true);
    try {
      await createPost({
        image: imageUri,
        foodName: nutritionData.name || 'Unknown Food',
        caption: caption || '',
        nutrition: {
          calories: Number(nutritionData.calories) || 0,
          protein: Number(nutritionData.protein) || 0,
          carbs: Number(nutritionData.carbs) || 0,
          fat: Number(nutritionData.fat) || 0,
        },
      });
      setIsPosting(false);
      Alert.alert(
        'Success',
        'Posted to your feed!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setIsPosting(false);
      Alert.alert('Error', 'Failed to post to feed. Please try again.');
    }
  };

  if (isAnalyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Analyzing your food...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!nutritionData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to analyze image</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Nutrition Results</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Food Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUri }}
            style={styles.foodImage}
            resizeMode="cover"
          />
        </View>

        {/* Nutrition Data */}
        <View style={styles.nutritionContainer}>
          <Text style={styles.foodName}>
            {nutritionData.name || 'Unknown Food'}
          </Text>
          
          <View style={styles.nutritionGrid}>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {Number(nutritionData.calories) || 0}
              </Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {Number(nutritionData.protein) || 0}g
              </Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {Number(nutritionData.carbs) || 0}g
              </Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text style={styles.nutritionValue}>
                {Number(nutritionData.fat) || 0}g
              </Text>
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Caption Input for Posting */}
        <View style={styles.captionContainer}>
          <Text style={styles.captionLabel}>Add a caption (optional)</Text>
          <TextInput
            style={styles.captionInput}
            placeholder="Share your thoughts about this meal..."
            value={caption}
            onChangeText={setCaption}
            multiline
            numberOfLines={3}
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton, isLogging && styles.disabledButton]}
            onPress={handleAddToLog}
            disabled={isLogging}
          >
            <Plus size={20} color="white" style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>
              {isLogging ? 'Adding to Log...' : 'Add to Log'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton, isPosting && styles.disabledButton]}
            onPress={handlePostToFeed}
            disabled={isPosting}
          >
            <Share size={20} color={isPosting ? '#9CA3AF' : '#10B981'} style={styles.buttonIcon} />
            <Text style={[styles.secondaryButtonText, isPosting && styles.disabledText]}>
              {isPosting ? 'Posting to Feed...' : 'Post to Feed'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSpacer: {
    width: 40,
  },
  imageContainer: {
    padding: 16,
  },
  foodImage: {
    width: '100%',
    height: 250,
    borderRadius: 16,
  },
  nutritionContainer: {
    padding: 16,
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  nutritionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
  },
  nutritionItem: {
    alignItems: 'center',
    flex: 1,
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  captionContainer: {
    padding: 16,
  },
  captionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  captionInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  actionButtons: {
    padding: 16,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#10B981',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  footer: {
    height: 20,
  },
});