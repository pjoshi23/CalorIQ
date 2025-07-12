import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  addDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  onSnapshot,
  Timestamp,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { auth, firestore } from '../lib/firebase';

// Define meal type
export interface LoggedMeal {
  id: string;
  name: string;
  image: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  mealType: string;
  date: string; // ISO date string
  userId: string;
  createdAt: Timestamp;
}

// Define user profile type
export interface UserProfile {
  id: string;
  displayName: string;
  username: string;
  email: string;
  profilePicture: string;
  bio: string;
  followers: string[];
  following: string[];
  posts: number;
  joinedDate: Timestamp;
}

// Define post type
export interface Post {
  id: string;
  userId: string;
  userProfile: {
    id: string;
    displayName: string;
    username: string;
    profilePicture: string;
  };
  image: string;
  foodName: string;
  caption: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  likes: string[];
  comments: number;
  createdAt: Timestamp;
}

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, name?: string, profilePicture?: string | null) => Promise<User>;
  signOut: () => Promise<void>;
  loggedMeals: LoggedMeal[];
  posts: Post[];
  allUsers: UserProfile[];
  followingUsers: UserProfile[];
  addMeal: (meal: Omit<LoggedMeal, 'id' | 'time' | 'date' | 'userId' | 'createdAt'>) => Promise<void>;
  removeMeal: (mealId: string) => Promise<void>;
  getTodayMeals: () => LoggedMeal[];
  getRecentMeals: (limit?: number) => LoggedMeal[];
  getWeekMeals: () => { [key: string]: LoggedMeal[] };
  createPost: (postData: Omit<Post, 'id' | 'userId' | 'userProfile' | 'likes' | 'comments' | 'createdAt'>) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  getUserProfile: (userId: string) => Promise<UserProfile | null>;
  getFeedPosts: () => Post[];
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loggedMeals, setLoggedMeals] = useState<LoggedMeal[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [followingUsers, setFollowingUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Load user's meals and profile when they sign in
        loadUserMeals(user.uid);
        loadUserProfile(user.uid);
        loadAllUsers();
        loadPosts();
      } else {
        // Clear data when user signs out
        setLoggedMeals([]);
        setUserProfile(null);
        setPosts([]);
        setAllUsers([]);
        setFollowingUsers([]);
      }
    });
    return unsubscribe;
  }, []);

  // Load user profile
  const loadUserProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        
        // Check if this is an old profile with default values and update it
        const currentUser = auth.currentUser;
        if (currentUser && (data.displayName === 'User' || data.displayName === 'user')) {
          const emailPrefix = currentUser.email ? currentUser.email.split('@')[0] : 'user';
          const updatedProfile = {
            ...data,
            displayName: currentUser.displayName || emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1),
            username: `@${emailPrefix}`,
          };
          await updateDoc(doc(firestore, 'users', userId), updatedProfile);
          setUserProfile({ ...updatedProfile, id: userDoc.id });
        } else {
          setUserProfile({ ...data, id: userDoc.id });
        }
        
        loadFollowingUsers(data.following);
      } else {
        // Get the current user data to create profile
        const currentUser = auth.currentUser;
        if (!currentUser) {
          console.error('No current user found when creating profile');
          return;
        }
        
        // Create default profile if it doesn't exist
        // Use email prefix as username if displayName is not available
        const emailPrefix = currentUser.email ? currentUser.email.split('@')[0] : 'user';
        const defaultProfile: UserProfile = {
          id: userId,
          displayName: currentUser.displayName || emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1),
          username: `@${emailPrefix}`,
          email: currentUser.email || '',
          profilePicture: currentUser.photoURL || 'https://placeholder.com/150x150',
          bio: '',
          followers: [],
          following: [],
          posts: 0,
          joinedDate: Timestamp.now(),
        };
        await setDoc(doc(firestore, 'users', userId), defaultProfile);
        setUserProfile(defaultProfile);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Load all users for discover
  const loadAllUsers = () => {
    const usersRef = collection(firestore, 'users');
    const q = query(usersRef, orderBy('displayName'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users: UserProfile[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as UserProfile;
        users.push({ ...data, id: doc.id });
      });
      setAllUsers(users);
    });

    return unsubscribe;
  };

  // Load posts
  const loadPosts = () => {
    const postsRef = collection(firestore, 'posts');
    const q = query(postsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData: Post[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Post;
        postsData.push({ ...data, id: doc.id });
      });
      setPosts(postsData);
    });

    return unsubscribe;
  };

  // Load following users
  const loadFollowingUsers = async (followingIds: string[]) => {
    if (followingIds.length === 0) {
      setFollowingUsers([]);
      return;
    }

    const users: UserProfile[] = [];
    for (const userId of followingIds) {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          users.push({ ...data, id: userDoc.id });
        }
      } catch (error) {
        console.error('Error loading following user:', error);
      }
    }
    setFollowingUsers(users);
  };

  const loadUserMeals = (userId: string) => {
    const mealsRef = collection(firestore, 'meals');
    const q = query(
      mealsRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const meals: LoggedMeal[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        meals.push({
          id: doc.id,
          name: data.name,
          image: data.image,
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fat: data.fat,
          time: data.time,
          mealType: data.mealType,
          date: data.date,
          userId: data.userId,
          createdAt: data.createdAt,
        });
      });
      setLoggedMeals(meals);
    });

    return unsubscribe;
  };

  const signIn = async (email: string, password: string): Promise<User> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const signUp = async (email: string, password: string, name?: string, profilePicture?: string | null): Promise<User> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile if name is provided
    if (name) {
      await updateProfile(result.user, {
        displayName: name,
        photoURL: profilePicture || null,
      });
    }
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      id: result.user.uid,
      displayName: name || result.user.displayName || 'User',
      username: `@${email.split('@')[0]}`,
      email: email,
      profilePicture: profilePicture || result.user.photoURL || 'https://placeholder.com/150x150',
      bio: '',
      followers: [],
      following: [],
      posts: 0,
      joinedDate: Timestamp.now(),
    };
    
    try {
      await setDoc(doc(firestore, 'users', result.user.uid), userProfile);
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
    
    return result.user;
  };

  const signOutUser = async (): Promise<void> => {
    await firebaseSignOut(auth);
  };

  const addMeal = async (mealData: Omit<LoggedMeal, 'id' | 'time' | 'date' | 'userId' | 'createdAt'>) => {
    if (!user) throw new Error('User not authenticated');

    const now = new Date();
    const newMeal = {
      ...mealData,
      time: now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
      date: now.toISOString().split('T')[0], // YYYY-MM-DD format
      userId: user.uid,
      createdAt: Timestamp.now(),
    };
    
    try {
      await addDoc(collection(firestore, 'meals'), newMeal);
    } catch (error) {
      console.error('Error adding meal:', error);
      throw error;
    }
  };

  const removeMeal = async (mealId: string) => {
    try {
      await deleteDoc(doc(firestore, 'meals', mealId));
    } catch (error) {
      console.error('Error removing meal:', error);
      throw error;
    }
  };

  const createPost = async (postData: Omit<Post, 'id' | 'userId' | 'userProfile' | 'likes' | 'comments' | 'createdAt'>) => {
    if (!user || !userProfile) throw new Error('User not authenticated');

    const newPost = {
      ...postData,
      userId: user.uid,
      userProfile: {
        id: userProfile.id,
        displayName: userProfile.displayName,
        username: userProfile.username,
        profilePicture: userProfile.profilePicture,
      },
      likes: [],
      comments: 0,
      createdAt: Timestamp.now(),
    };

    try {
      await addDoc(collection(firestore, 'posts'), newPost);
      
      // Update user's post count
      await updateDoc(doc(firestore, 'users', user.uid), {
        posts: userProfile.posts + 1,
      });
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  };

  const likePost = async (postId: string) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const postRef = doc(firestore, 'posts', postId);
      const postDoc = await getDoc(postRef);
      
      if (postDoc.exists()) {
        const postData = postDoc.data() as Post;
        const likes = postData.likes || [];
        const isLiked = likes.includes(user.uid);
        
        if (isLiked) {
          await updateDoc(postRef, {
            likes: arrayRemove(user.uid),
          });
        } else {
          await updateDoc(postRef, {
            likes: arrayUnion(user.uid),
          });
        }
      }
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  };

  const followUser = async (userId: string) => {
    if (!user || !userProfile) throw new Error('User not authenticated');

    try {
      // Add to current user's following
      await updateDoc(doc(firestore, 'users', user.uid), {
        following: arrayUnion(userId),
      });

      // Add current user to target user's followers
      await updateDoc(doc(firestore, 'users', userId), {
        followers: arrayUnion(user.uid),
      });
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  };

  const unfollowUser = async (userId: string) => {
    if (!user || !userProfile) throw new Error('User not authenticated');

    try {
      // Remove from current user's following
      await updateDoc(doc(firestore, 'users', user.uid), {
        following: arrayRemove(userId),
      });

      // Remove current user from target user's followers
      await updateDoc(doc(firestore, 'users', userId), {
        followers: arrayRemove(user.uid),
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  };

  const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data() as UserProfile;
        return { ...data, id: userDoc.id };
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  };

  const getFeedPosts = (): Post[] => {
    if (!userProfile) return [];
    
    // Get posts from users that the current user follows
    const followingIds = userProfile.following;
    return posts.filter(post => followingIds.includes(post.userId));
  };

  const getTodayMeals = (): LoggedMeal[] => {
    const today = new Date().toISOString().split('T')[0];
    console.log('Today:', today);
    console.log('All meals:', loggedMeals.map(m => ({ id: m.id, date: m.date, name: m.name })));
    const todayMeals = loggedMeals.filter(meal => {
      // Handle potential timezone issues by comparing date strings
      const mealDate = meal.date;
      const isToday = mealDate === today;
      console.log('Checking meal:', meal.name, 'date:', mealDate, 'matches today:', isToday);
      return isToday;
    });
    console.log('Today meals:', todayMeals.length);
    return todayMeals;
  };

  const getRecentMeals = (limit: number = 5): LoggedMeal[] => {
    return loggedMeals.slice(0, limit);
  };

  const getWeekMeals = (): { [key: string]: LoggedMeal[] } => {
    const weekData: { [key: string]: LoggedMeal[] } = {};
    
    // Get the start of the current week (Monday)
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, but we want Monday = 0
    startOfWeek.setDate(now.getDate() - daysToSubtract);
    startOfWeek.setHours(0, 0, 0, 0);

    // Generate dates for the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const dateString = date.toISOString().split('T')[0];
      weekData[dateString] = [];
    }

    // Filter meals for this week
    loggedMeals.forEach(meal => {
      const mealDate = new Date(meal.date);
      const weekStart = new Date(startOfWeek);
      const weekEnd = new Date(startOfWeek);
      weekEnd.setDate(startOfWeek.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      if (mealDate >= weekStart && mealDate <= weekEnd) {
        const dateString = meal.date;
        if (weekData[dateString]) {
          weekData[dateString].push(meal);
        }
      }
    });

    return weekData;
  };

  const value: AuthContextType = {
    user,
    userProfile,
    signIn,
    signUp,
    signOut: signOutUser,
    loggedMeals,
    posts,
    allUsers,
    followingUsers,
    addMeal,
    removeMeal,
    getTodayMeals,
    getRecentMeals,
    getWeekMeals,
    createPost,
    likePost,
    followUser,
    unfollowUser,
    getUserProfile,
    getFeedPosts,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};