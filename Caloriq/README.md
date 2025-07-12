# Caloriq - Nutrition Tracking App

A React Native Expo app for tracking nutrition with social features including user following and meal sharing.

## Features

### Core Features
- **Food Analysis**: AI-powered nutrition analysis using Google Gemini Vision API
- **Meal Logging**: Track daily meals with detailed nutrition information
- **Progress Tracking**: Visual progress rings for calories and macros
- **User Authentication**: Firebase authentication with user profiles

### Social Features
- **User Discovery**: Browse and follow other users
- **Feed System**: View posts from users you follow
- **Post Sharing**: Share meals to your feed for others to see
- **Like System**: Like posts from other users
- **Real-time Updates**: Live updates for posts and user data

## Setup Instructions

### 1. Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Enable Firestore Database
4. Add your Firebase config to `lib/firebase.ts`

### 2. Google Gemini API Setup
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add the key to your environment variables:
   ```
   EXPO_PUBLIC_GEMINI_API_KEY=your-api-key-here
   ```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the App
```bash
npx expo start
```

## Database Structure

### Users Collection
```javascript
{
  id: "user_id",
  displayName: "User Name",
  username: "@username",
  email: "user@example.com",
  profilePicture: "https://...",
  bio: "User bio",
  followers: ["follower_id_1", "follower_id_2"],
  following: ["following_id_1", "following_id_2"],
  posts: 5,
  joinedDate: Timestamp
}
```

### Posts Collection
```javascript
{
  id: "post_id",
  userId: "user_id",
  userProfile: {
    id: "user_id",
    displayName: "User Name",
    username: "@username",
    profilePicture: "https://..."
  },
  image: "image_uri",
  foodName: "Grilled Chicken",
  caption: "Delicious meal!",
  nutrition: {
    calories: 320,
    protein: 28,
    carbs: 15,
    fat: 18
  },
  likes: ["user_id_1", "user_id_2"],
  comments: 0,
  createdAt: Timestamp
}
```

### Meals Collection
```javascript
{
  id: "meal_id",
  userId: "user_id",
  name: "Grilled Chicken",
  image: "image_uri",
  calories: 320,
  protein: 28,
  carbs: 15,
  fat: 18,
  time: "2:30 PM",
  mealType: "Meal",
  date: "2024-01-15",
  createdAt: Timestamp
}
```

## How the Followers System Works

### 1. User Discovery
- Users can browse all other users in the app
- Search functionality to find specific users
- Follow/unfollow buttons with real-time updates

### 2. Feed System
- Feed shows posts only from users you follow
- Real-time updates when new posts are created
- Like functionality with live like counts

### 3. Post Creation
- After analyzing food, users can post to their feed
- Posts include nutrition information and captions
- Posts are visible to followers in their feed

### 4. Profile Integration
- Real follower/following counts
- Grid view shows user's posts
- List view shows all logged meals

## Key Components

- **AuthContext**: Manages user state, following relationships, and posts
- **FeedScreen**: Displays posts from followed users
- **DiscoverScreen**: Browse and follow other users
- **ProfileScreen**: Shows user stats and posts/meals
- **NutritionResultScreen**: Create posts after food analysis

## Environment Variables

Create a `.env` file in the root directory:
```
EXPO_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

## Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all user profiles
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Posts can be read by all, written by post owner
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
    
    // Meals can only be accessed by the owner
    match /meals/{mealId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
``` 