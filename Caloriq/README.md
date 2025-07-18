# Caloriq – Feature Overview & App Walkthrough

Caloriq is a modern nutrition tracking app that combines AI-powered food analysis, detailed meal logging, and a vibrant social experience. Below is a comprehensive overview of its features and a walkthrough of the user journey.

---

## 🌟 Core Features

### 1. **AI-Powered Food Analysis**
- Instantly analyze the nutritional content of your meals using the Google Gemini Vision API.
- Snap a photo or select from your gallery; the app detects calories, protein, carbs, and fat.
- Results are shown in a visually rich summary, ready to log or share.

### 2. **Meal Logging & Progress Tracking**
- Log meals with a single tap after analysis, or manually add details.
- Each meal entry includes a photo, nutrition breakdown, and meal type (breakfast, lunch, dinner, snack).
- Daily and weekly progress is visualized with animated progress rings and macro bars, helping you stay on track with your goals.

### 3. **Social Feed & Community**
- Share your meals to a social feed for your followers to see.
- Like and comment on posts from users you follow.
- Discover new users, follow/unfollow, and grow your nutrition community.

### 4. **User Profiles & Achievements**
- Each user has a profile with a picture, bio, stats, and a grid of shared meals.
- View your own meal log in a list, and see your social posts in a grid.
- Real-time follower/following counts and live updates.

### 5. **Authentication & Security**
- Secure sign up and sign in with Firebase Authentication.
- User data is protected and only accessible by the owner (meals) or followers (posts).

---

## 🚀 App Walkthrough

### **Onboarding & Authentication**
- **Sign Up:** New users create an account with name, email, password, and optional profile picture (camera or gallery).
- **Sign In:** Existing users log in securely. Password visibility toggle and error handling included.

### **Home Screen**
- **Personalized Greeting:** Dynamic greeting based on time of day and user's name.
- **Progress Overview:** Animated rings and macro cards show your calorie and macro progress for the day.
- **Recent Meals:** Quick glance at your latest logged meals, with images and nutrition stats.
- **Quick Actions:** Easily access the camera to scan a new meal or view your full meal log.

### **Meal Logging**
- **Camera & Gallery:** Use the in-app camera or pick from your gallery to analyze a meal.
- **AI Nutrition Analysis:** The app processes the image and returns a detailed nutrition breakdown.
- **Log or Share:** Add the meal to your personal log, or share it to your social feed with a caption.

### **Meal Log**
- **Daily Log:** View all meals logged for the current day, with options to edit or delete.
- **Macro Breakdown:** See your daily totals for calories, protein, carbs, and fat, with visual progress bars.
- **Weekly Trends:** Track your nutrition over the week for deeper insights.

### **Social Feed**
- **Posts from Followed Users:** Your feed shows meals shared by users you follow.
- **Engagement:** Like posts, view like counts, and comment (future feature).
- **Post Details:** Each post displays the meal photo, nutrition info, caption, and user profile.

### **User Discovery**
- **Browse Users:** Search and discover other users in the app.
- **Follow/Unfollow:** Instantly follow or unfollow users, with real-time updates to your feed.
- **Profile Viewing:** Tap on a user to view their profile, posts, and stats.

### **Profile**
- **Your Stats:** See your follower/following counts, bio, and joined date.
- **Posts Grid:** View all meals you've shared to the feed.
- **Meal Log List:** Access your full meal logging history.

---

## 🛠️ Unique & Advanced Features

- **AI Vision Integration:** Seamless use of Google Gemini Vision for food recognition and nutrition estimation.
- **Animated Progress Rings:** Custom SVG-based rings for calories and macros, with gradient fills and smooth animation.
- **Real-Time Social Updates:** Instant updates to feed, likes, and follower counts using Firebase.
- **Rich Meal Cards:** Visually appealing cards for meals and posts, with badges, icons, and macro breakdowns.
- **Flexible Meal Types:** Support for different meal types, each with unique color coding.
- **Accessibility:** Keyboard avoiding views, large touch targets, and clear error messages for a smooth user experience.

---

## 🧭 User Flow Summary

1. **Sign Up / Sign In**
2. **Home:** See your progress and recent meals.
3. **Scan or Log a Meal:** Use the camera or gallery, analyze with AI, log or share.
4. **View Log:** Track your daily and weekly nutrition.
5. **Social Feed:** Engage with your community.
6. **Discover:** Find and follow new users.
7. **Profile:** Manage your account, see your stats and history.

---

This app is designed to make nutrition tracking effortless, insightful, and social. Whether you're focused on your own goals or want to share your journey with others, Caloriq provides the tools and community to help you succeed. 