import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TransactionScreen from './TransactionScreen';
import OrderScreen from './OrderScreen';
import ProfileScreen from './ProfileScreen';
import AuthScreen from './AuthScreen';
import ChatScreen from './ChatScreen';
import AuctionDetailScreen from './AuctionDetailScreen';
import CategoryAuctionsScreen from './CategoryAuctionsScreen';
import { 
  API_BASE_URL, 
  login, 
  sendCode, 
  verifyOtpRegistration, 
  signup, 
  forgotPassword, 
  verifyOtpForgotPassword, 
  updatePassword, 
  deleteUser,
  getAllAuctionUsingPaging,
  getAuctions,
  getCustomerOrders,
  getCustomerInvoices,
  paymentHistory,
  getAllConversation,
  getUserMessages,
  getUser
} from './apiRoutes';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [authForm, setAuthForm] = useState({ 
    fname: '', 
    lname: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    phone: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [userData, setUserData] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otpMode, setOtpMode] = useState('signup'); // 'signup' or 'forgot-password'
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showAuctionDetail, setShowAuctionDetail] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [favoriteAuctions, setFavoriteAuctions] = useState([]);
  const [showCategoryAuctions, setShowCategoryAuctions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [redirectFromAuction, setRedirectFromAuction] = useState(false);
  
  // Pagination states
  const [orderPage, setOrderPage] = useState(1);
  
  // Data states for different screens
  const [auctionData, setAuctionData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [transactionData, setTransactionData] = useState([]);
  const [chatData, setChatData] = useState([]);
  
  // Loading states for different data
  const [auctionLoading, setAuctionLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  
  // Error states for different data
  const [auctionError, setAuctionError] = useState(null);
  const [orderError, setOrderError] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [chatError, setChatError] = useState(null);

  const apiUrl = API_BASE_URL;

  // Token storage keys
  const TOKEN_KEY = 'auth_token';
  const USER_DATA_KEY = 'user_data';

  // Token management functions
  const saveToken = async (token) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      console.log('Token saved successfully');
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  const getStoredToken = async () => {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      console.log('Retrieved stored token:', token ? 'Available' : 'Not available');
      return token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  };

  const saveUserData = async (userData) => {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      console.log('User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const getStoredUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return null;
    }
  };

  const clearStoredData = async () => {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_DATA_KEY]);
      console.log('Stored data cleared successfully');
    } catch (error) {
      console.error('Error clearing stored data:', error);
    }
  };

  // Handle token expiration during API calls
  const handleTokenExpiration = async () => {
    console.log('Token expired during API call, logging out user...');
    await clearStoredData();
    setAuthToken(null);
    setUserData(null);
    setIsLoggedIn(false);
    setCurrentTab('home');
    setShowAuth(false);
    setShowProfile(false);
    setShowOrder(false);
    setShowTransaction(false);
    setShowChat(false);
    setShowForgotPassword(false);
    setShowOtpVerification(false);
    setShowNewPassword(false);
    setAuthForm({ fname: '', lname: '', email: '', password: '', confirmPassword: '', phone: '', code: '' });
    
    // Clear all fetched data
    setAuctionData([]);
    setOrderData([]);
    setTransactionData([]);
    setChatData([]);
    setAuctionError(null);
    setOrderError(null);
    setTransactionError(null);
    setChatError(null);
    
    Alert.alert(
      'Session Expired',
      'Your session has expired. Please sign in again.',
      [{ text: 'OK' }]
    );
  };

  // Debug function to check token status
  // Handle image loading errors
  const handleImageError = (auction, fallbackText = '🏛️') => {
    console.log('Image failed to load for auction:', auction.id || auction.title);
    return fallbackText;
  };

  // Auction detail handlers
  const handleAuctionCardPress = (auction) => {
    setSelectedAuction(auction);
    setShowAuctionDetail(true);
  };

  const handleBackFromAuctionDetail = () => {
    setShowAuctionDetail(false);
    setSelectedAuction(null);
  };

  const handleExploreCategory = (categoryName) => {
    setSelectedCategory(categoryName);
    setShowCategoryAuctions(true);
  };

  const handleBackFromCategoryAuctions = () => {
    setShowCategoryAuctions(false);
    setSelectedCategory('');
  };

  const handleCategoryAuctionPress = (auction) => {
    setSelectedAuction(auction);
    setShowAuctionDetail(true);
    setShowCategoryAuctions(false);
  };

  const handleToggleFavorite = (auction) => {
    // Check if user is logged in before allowing favorite toggle
    if (!isLoggedIn || !authToken) {
      console.log('User not logged in, redirecting to login for favorite toggle...');
      // Directly navigate to login screen
      setRedirectFromAuction(true);
      setShowAuth(true);
      setAuthMode('signin');
      return;
    }

    if (favoriteAuctions.some(fav => fav.id === auction.id)) {
      setFavoriteAuctions(favoriteAuctions.filter(fav => fav.id !== auction.id));
    } else {
      setFavoriteAuctions([...favoriteAuctions, auction]);
    }
  };

  const handlePlaceBid = async (bidAmount) => {
    // Check if user is logged in before allowing bid placement
    if (!isLoggedIn || !authToken) {
      console.log('User not logged in, redirecting to login...');
      // Directly navigate to login screen
      setRedirectFromAuction(true);
      setShowAuth(true);
      setAuthMode('signin');
      return;
    }

    try {
      // Here you would make an API call to place the bid
      console.log('Placing bid:', bidAmount, 'for auction:', selectedAuction?.id);
      // Example API call:
      // const response = await fetch(`${apiUrl}/auction/bid/${selectedAuction.id}`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${authToken}`
      //   },
      //   body: JSON.stringify({ bidAmount })
      // });
      // const data = await response.json();
      // if (data.success) {
      //   // Update auction data or show success message
      // }
    } catch (error) {
      console.error('Error placing bid:', error);
    }
  };

  const debugTokenStatus = async () => {
    const storedToken = await getStoredToken();
    const storedUserData = await getStoredUserData();
    
    console.log('=== TOKEN DEBUG INFO ===');
    console.log('Current authToken state:', authToken ? 'Available' : 'Not available');
    console.log('Stored token:', storedToken ? 'Available' : 'Not available');
    console.log('Is logged in:', isLoggedIn);
    console.log('User data:', userData ? 'Available' : 'Not available');
    console.log('Stored user data:', storedUserData ? 'Available' : 'Not available');
    
    if (authToken) {
      console.log('Current token (first 30 chars):', authToken.substring(0, 30) + '...');
    }
    if (storedToken) {
      console.log('Stored token (first 30 chars):', storedToken.substring(0, 30) + '...');
    }
    console.log('========================');
    
    // Show alert with token status
    Alert.alert(
      'Token Debug Info',
      `Current Token: ${authToken ? 'Available' : 'Not available'}\n` +
      `Stored Token: ${storedToken ? 'Available' : 'Not available'}\n` +
      `Is Logged In: ${isLoggedIn}\n` +
      `User Data: ${userData ? 'Available' : 'Not available'}`,
      [{ text: 'OK' }]
    );
  };

  // Initialize app with stored token on startup
  useEffect(() => {
    const initializeApp = async () => {
      console.log('Initializing app...');
      const storedToken = await getStoredToken();
      const storedUserData = await getStoredUserData();
      
      if (storedToken && storedUserData) {
        console.log('Found stored token and user data, restoring session...');
        setAuthToken(storedToken);
        setUserData(storedUserData);
        setIsLoggedIn(true);
        
        // Validate token by making a test API call with retry logic
        let validationAttempts = 0;
        const maxAttempts = 3;
        
        const validateToken = async () => {
          try {
            console.log(`Token validation attempt ${validationAttempts + 1}/${maxAttempts}`);
            const response = await fetch(`${apiUrl}${getUser}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${storedToken}`
              },
            });
            
            if (response.ok) {
              console.log('Stored token is valid, fetching user data...');
              await fetchAllUserData(storedToken);
              return true;
            } else if (response.status === 401 || response.status === 403) {
              // Only logout for actual authentication errors
              console.log('Token is expired or invalid (401/403), clearing stored data...');
              await clearStoredData();
              setAuthToken(null);
              setUserData(null);
              setIsLoggedIn(false);
              return true;
            } else {
              // For other errors (500, 502, etc.), don't logout immediately
              console.log(`Server error (${response.status}), will retry...`);
              return false;
            }
          } catch (error) {
            console.error(`Error validating stored token (attempt ${validationAttempts + 1}):`, error);
            // For network errors, don't logout immediately
            return false;
          }
        };
        
        // Retry validation up to 3 times with delays
        while (validationAttempts < maxAttempts) {
          const success = await validateToken();
          if (success) break;
          
          validationAttempts++;
          if (validationAttempts < maxAttempts) {
            console.log(`Retrying token validation in ${validationAttempts * 1000}ms...`);
            await new Promise(resolve => setTimeout(resolve, validationAttempts * 1000));
          }
        }
        
        // If all attempts failed but not due to auth errors, keep user logged in
        if (validationAttempts >= maxAttempts) {
          console.log('Token validation failed after all attempts, but keeping user logged in for now...');
          // Don't logout - let the user continue with their session
          // The token will be validated again when they make actual API calls
        }
      } else {
        console.log('No stored token found, user needs to login');
      }
    };
    
    initializeApp();
  }, []);

  // Auto-fetch data when authToken changes (for existing logged-in users)
  useEffect(() => {
    if (authToken && isLoggedIn) {
      console.log('Auth token changed, fetching user data...');
      // Only fetch if we don't already have data
      if (auctionData.length === 0 && orderData.length === 0 && transactionData.length === 0 && chatData.length === 0) {
        fetchAllUserData(authToken);
      }
    }
  }, [authToken, isLoggedIn]);

  // Fetch auction data for all users (logged in or not) on app startup
  useEffect(() => {
    console.log('Fetching auction data for public viewing...');
    fetchAuctionData(); // This will work without authentication now
  }, []);

  // Periodic token validation (every 5 minutes)
  useEffect(() => {
    if (!authToken || !isLoggedIn) return;

    const validateTokenPeriodically = async () => {
      try {
        const response = await fetch(`${apiUrl}${getUser}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
        });
        
        if (response.status === 401 || response.status === 403) {
          console.log('Token expired during periodic validation, logging out...');
          await handleTokenExpiration();
        }
      } catch (error) {
        console.log('Periodic token validation failed (network error), continuing...');
        // Don't logout for network errors during periodic validation
      }
    };

    const interval = setInterval(validateTokenPeriodically, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [authToken, isLoggedIn]);

  // Data fetching functions with error handling and fallbacks
  const fetchAuctionData = async (token = authToken) => {
    // Allow auction data fetch without authentication for public viewing
    console.log('Fetching auction data...');
    console.log('Auth token available:', !!token);

    setAuctionLoading(true);
    setAuctionError(null);
    
    try {
      console.log('Fetching auction data...');
      console.log('Using endpoint:', `${apiUrl}${getAuctions}1`); // Using page 1 for initial load
      
      // Use the correct auction endpoint with pagination
      const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
      };
      
      // Add authorization header only if token is available
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${apiUrl}${getAuctions}1`, {
        method: 'GET',
        headers,
      });

      console.log('Auction response status:', response.status);
      
      if (!response.ok) {
        // Check if it's an authentication error
        if (response.status === 401 || response.status === 403) {
          console.log('Authentication error during auction fetch, handling token expiration...');
          await handleTokenExpiration();
          return;
        }
        
        console.log('getAuctions endpoint failed, trying admin endpoint as fallback...');
        // Try the admin endpoint as fallback
        const fallbackResponse = await fetch(`${apiUrl}${getAllAuctionUsingPaging}1`, {
          method: 'GET',
          headers,
        });
        
        if (!fallbackResponse.ok) {
          if (fallbackResponse.status === 401 || fallbackResponse.status === 403) {
            console.log('Authentication error during fallback auction fetch, handling token expiration...');
            await handleTokenExpiration();
            return;
          }
          
          const errorText = await fallbackResponse.text();
          console.error('Both auction endpoints failed:', errorText);
          throw new Error(`Server error: ${fallbackResponse.status} - ${errorText.substring(0, 100)}`);
        }
        
        const fallbackData = await fallbackResponse.json();
        console.log('Fallback auction data received:', fallbackData);
        
        if (fallbackData.success && fallbackData.data) {
          setAuctionData(fallbackData.data);
        } else {
          setAuctionData([]);
        }
        return;
      }

      const data = await response.json();
      console.log('Auction data received:', data);
      console.log('Auction data structure:', JSON.stringify(data, null, 2));
      
      // Log first auction item structure for debugging
      if (data.success && data.data && data.data.length > 0) {
        console.log('First auction item structure:', JSON.stringify(data.data[0], null, 2));
        console.log('Available image fields:', {
          image: data.data[0].image,
          images: data.data[0].images,
          lotImage: data.data[0].lotImage,
          lotImages: data.data[0].lotImages,
        });
      }
      
      if (data.success && data.data) {
        console.log('Setting auction data:', data.data);
        setAuctionData(data.data);
      } else if (data.success && data.auctions) {
        console.log('Setting auction data (auctions format):', data.auctions);
        setAuctionData(data.auctions);
      } else if (data.success && Array.isArray(data)) {
        console.log('Setting auction data (array format):', data);
        setAuctionData(data);
      } else if (data.data && Array.isArray(data.data)) {
        console.log('Setting auction data (data array):', data.data);
        setAuctionData(data.data);
      } else {
        setAuctionData([]);
        console.warn('Auction API returned no data or success: false');
        console.warn('Response structure:', data);
      }
    } catch (error) {
      console.error('Auction fetch error:', error);
      setAuctionError(error.message);
      setAuctionData([]);
      
      // Fallback: Show user-friendly error
      Alert.alert(
        'Auction Data Error',
        'Unable to load auction data. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setAuctionLoading(false);
    }
  };

  const fetchOrderData = async (token = authToken, page = orderPage) => {
    console.log('=== fetchOrderData called ===');
    console.log('Token provided:', !!token);
    console.log('AuthToken state:', !!authToken);
    console.log('IsLoggedIn state:', isLoggedIn);
    console.log('Page provided:', page);
    console.log('OrderPage state:', orderPage);
    
    // Ensure page is a valid number
    const validPage = page || orderPage || 1;
    console.log('Using page:', validPage);
    
    if (!token) {
      console.log('No auth token available for order data fetch');
      return;
    }
    
    if (!isLoggedIn) {
      console.log('User not logged in, skipping order data fetch');
      return;
    }

    setOrderLoading(true);
    setOrderError(null);
    
    try {
      console.log('Fetching order data...');
      console.log('Token being used:', token ? `${token.substring(0, 20)}...` : 'No token');
      console.log('Token type:', typeof token);
      console.log('Token length:', token ? token.length : 0);
      console.log('Page:', validPage);
      console.log('Endpoint:', `${apiUrl}${getCustomerOrders}${validPage}`);
      console.log('Full URL:', `${apiUrl}${getCustomerOrders}${validPage}`);
      
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
      } else {
        console.error('No token available for authorization!');
      }
      
      console.log('Request headers:', headers);
      
      const response = await fetch(`${apiUrl}${getCustomerOrders}${validPage}`, {
        method: 'GET',
        headers,
      });

      console.log('Order response status:', response.status);
      
      if (!response.ok) {
        // Check if it's an authentication error
        if (response.status === 401 || response.status === 403) {
          console.log('Authentication error during order fetch, handling token expiration...');
          await handleTokenExpiration();
          return;
        }
        
        const errorText = await response.text();
        console.error('Order API error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log('Order data received:', data);
      
      if (data.success && data.applications) {
        setOrderData(data.applications);
        console.log('Setting order data from applications:', data.applications);
      } else if (data.success && data.data) {
        setOrderData(data.data);
        console.log('Setting order data from data:', data.data);
      } else if (data.success && Array.isArray(data)) {
        setOrderData(data);
        console.log('Setting order data from array:', data);
      } else {
        setOrderData([]);
        console.warn('Order API returned no data or success: false');
        console.warn('Response structure:', data);
      }
    } catch (error) {
      console.error('Order fetch error:', error);
      setOrderError(error.message);
      setOrderData([]);
      
      // Fallback: Show user-friendly error
      Alert.alert(
        'Order Data Error',
        'Unable to load order data. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setOrderLoading(false);
    }
  };

  const loadMoreOrders = async () => {
    if (!orderLoading) {
      const nextPage = orderPage + 1;
      setOrderPage(nextPage);
      await fetchOrderData(authToken, nextPage);
    }
  };



  const fetchTransactionData = async (token = authToken) => {
    if (!token) {
      console.log('No auth token available for transaction data fetch');
      return;
    }

    setTransactionLoading(true);
    setTransactionError(null);
    
    try {
      console.log('Fetching transaction data...');
      console.log('Endpoint:', `${apiUrl}${paymentHistory}`);
      
      const response = await fetch(`${apiUrl}${paymentHistory}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Transaction response status:', response.status);
      
      if (!response.ok) {
        // Check if it's an authentication error
        if (response.status === 401 || response.status === 403) {
          console.log('Authentication error during transaction fetch, handling token expiration...');
          await handleTokenExpiration();
          return;
        }
        
        const errorText = await response.text();
        console.error('Transaction API error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log('Transaction data received:', data);
      
      if (data.success && data.data) {
        setTransactionData(data.data);
      } else if (data.success && Array.isArray(data)) {
        setTransactionData(data);
      } else {
        setTransactionData([]);
        console.warn('Transaction API returned no data or success: false');
      }
    } catch (error) {
      console.error('Transaction fetch error:', error);
      setTransactionError(error.message);
      setTransactionData([]);
      
      // Fallback: Show user-friendly error
      Alert.alert(
        'Transaction Data Error',
        'Unable to load transaction data. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setTransactionLoading(false);
    }
  };

  const fetchChatData = async (token = authToken) => {
    console.log('=== CHAT DATA FETCH DEBUG ===');
    console.log('Token provided:', !!token);
    console.log('Token type:', typeof token);
    console.log('Token length:', token ? token.length : 0);
    console.log('Is logged in:', isLoggedIn);
    console.log('User data available:', !!userData);
    
    if (!isLoggedIn) {
      console.log('User not logged in, skipping chat data fetch');
      return;
    }
    
    if (!token) {
      console.log('No auth token available for chat data fetch');
      return;
    }

    setChatLoading(true);
    setChatError(null);
    
    try {
      console.log('Fetching chat data...');
      const endpoint = `${apiUrl}${getAllConversation}/${userData._id}`;
      console.log('Full URL:', endpoint);
      console.log('Token being sent:', token ? `${token.substring(0, 20)}...` : 'No token');
      
      const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      console.log('Request headers:', headers);
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: headers,
      });

      console.log('Chat response status:', response.status);
      
      if (!response.ok) {
        // Check if it's an authentication error
        if (response.status === 401 || response.status === 403) {
          console.log('Authentication error during chat fetch, handling token expiration...');
          await handleTokenExpiration();
          return;
        }
        
        const errorText = await response.text();
        console.error('Chat API error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log('Chat data received:', data);
      
      if (data.success && data.data) {
        setChatData(data.data);
      } else if (data.success && Array.isArray(data)) {
        setChatData(data);
      } else {
        setChatData([]);
        console.warn('Chat API returned no data or success: false');
      }
    } catch (error) {
      console.error('Chat fetch error:', error);
      setChatError(error.message);
      setChatData([]);
      
      // Fallback: Show user-friendly error
      Alert.alert(
        'Chat Data Error',
        'Unable to load chat data. Please try again later.',
        [{ text: 'OK' }]
      );
    } finally {
      setChatLoading(false);
    }
  };

  // Fetch all data when user logs in
  const fetchAllUserData = async (token) => {
    console.log('Fetching all user data with token:', token ? 'Available' : 'Not available');
    
    if (!token) {
      console.log('No token provided for data fetch');
      return;
    }
    
    // Fetch data in parallel for better performance
    console.log('Starting parallel data fetch with token:', token ? `${token.substring(0, 20)}...` : 'No token');
    await Promise.allSettled([
      fetchAuctionData(token),
      fetchOrderData(token, 1), // Explicitly pass page 1
      fetchTransactionData(token),
      fetchChatData(token)
    ]);
    
    console.log('All user data fetch completed');
  };

  // Refresh functions for each screen
  const refreshAuctionData = () => {
    console.log('Refreshing auction data...');
    console.log('Auth token available:', !!authToken);
    if (authToken) {
      fetchAuctionData(authToken);
    } else {
      console.log('No auth token available for auction refresh');
    }
  };

  const refreshOrderData = () => {
    console.log('Refreshing order data...');
    console.log('AuthToken available:', !!authToken);
    console.log('IsLoggedIn:', isLoggedIn);
    
    if (!authToken || !isLoggedIn) {
      console.log('Cannot refresh order data - user not authenticated');
      return;
    }
    
    setOrderPage(1);
    fetchOrderData(authToken, 1);
  };

  const refreshTransactionData = () => {
    console.log('Refreshing transaction data...');
    fetchTransactionData(authToken);
  };

  const refreshChatData = () => {
    console.log('Refreshing chat data...');
    console.log('AuthToken available:', !!authToken);
    console.log('IsLoggedIn:', isLoggedIn);
    
    if (!authToken || !isLoggedIn) {
      console.log('Cannot refresh chat data - user not authenticated');
      return;
    }
    
    fetchChatData(authToken);
  };

  // Translations
  const t = (key) => {
    const translations = {
      // Home Screen
      'welcome': isArabic ? 'مرحباً' : 'Welcome',
      'guest_user': isArabic ? 'مستخدم ضيف' : 'Guest User',
      'all_auctions': isArabic ? 'جميع المزادات' : 'All Auctions',
      'view_all': isArabic ? 'عرض الكل' : 'View All',
      'no_auctions': isArabic ? 'لا توجد مزادات متاحة' : 'No auctions available',
      
      // Navigation
      'home': isArabic ? 'الرئيسية' : 'Home',
      'order': isArabic ? 'الطلبات' : 'Order',
      'transaction': isArabic ? 'المعاملات' : 'Transaction',
      'chat': isArabic ? 'الدردشة' : 'Chat',
      'profile': isArabic ? 'الملف الشخصي' : 'Profile',
      
      // Auth
      'sign_in': isArabic ? 'تسجيل الدخول' : 'Sign In',
      'sign_up': isArabic ? 'إنشاء حساب' : 'Sign Up',
      'forgot_password': isArabic ? 'نسيت كلمة المرور؟' : 'Forgot Password?',
      'email': isArabic ? 'البريد الإلكتروني' : 'Email',
      'password': isArabic ? 'كلمة المرور' : 'Password',
      'confirm_password': isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password',
      'first_name': isArabic ? 'الاسم الأول' : 'First Name',
      'last_name': isArabic ? 'اسم العائلة' : 'Last Name',
      'phone': isArabic ? 'رقم الهاتف' : 'Phone Number',
      'verification_code': isArabic ? 'رمز التحقق' : 'Verification Code',
      'send_code': isArabic ? 'إرسال الرمز' : 'Send Code',
      'verify_code': isArabic ? 'تحقق من الرمز' : 'Verify Code',
      'new_password': isArabic ? 'كلمة المرور الجديدة' : 'New Password',
      'update_password': isArabic ? 'تحديث كلمة المرور' : 'Update Password',
      'back_to_login': isArabic ? 'العودة لتسجيل الدخول' : 'Back to Login',
      
      // Profile
      'personal_info': isArabic ? 'المعلومات الشخصية' : 'Personal Info',
      'favorites': isArabic ? 'المفضلة' : 'Favorites',
      'notifications': isArabic ? 'الإشعارات' : 'Notifications',
      'language': isArabic ? 'اللغة' : 'Language',
      'logout': isArabic ? 'تسجيل الخروج' : 'Logout',
      'delete_account': isArabic ? 'حذف الحساب' : 'Delete Account',
      
      // Order
      'order_tracking': isArabic ? 'تتبع الطلبات' : 'Order Tracking',
      'all': isArabic ? 'الكل' : 'All',
      'shipped': isArabic ? 'تم الشحن' : 'Shipped',
      'transit': isArabic ? 'قيد النقل' : 'Transit',
      'delivered': isArabic ? 'تم التوصيل' : 'Delivered',
      'no_orders': isArabic ? 'لا توجد طلبات' : 'No orders found',
      
      // Transaction
      'payment_deposits': isArabic ? 'الدفع والودائع' : 'Payment & Deposits',
      'balance': isArabic ? 'الرصيد' : 'Balance',
      'payment_history': isArabic ? 'سجل المدفوعات' : 'Payment History',
      'refund_requests': isArabic ? 'طلبات الاسترداد' : 'Refund Requests',
      'no_transactions': isArabic ? 'لا توجد معاملات' : 'No transactions found',
      
      // Chat
      'messages': isArabic ? 'الرسائل' : 'Messages',
      'search_messages': isArabic ? 'البحث في الرسائل' : 'Search messages',
      'no_messages': isArabic ? 'لا توجد رسائل' : 'No messages yet',
    };
    return translations[key] || key;
  };

  const handleTabPress = (tab) => {
    if (tab === 'home') {
      setCurrentTab('home');
      setShowAuth(false);
      setShowProfile(false);
      setShowOrder(false);
      setShowTransaction(false);
      setShowChat(false);
      setShowForgotPassword(false);
      setShowOtpVerification(false);
      setShowNewPassword(false);
    } else if (tab === 'profile') {
      // Profile tab is accessible for all users (logged in or not)
      setCurrentTab('profile');
      setShowAuth(false);
      setShowProfile(true);
      setShowOrder(false);
      setShowTransaction(false);
      setShowChat(false);
      setShowForgotPassword(false);
      setShowOtpVerification(false);
      setShowNewPassword(false);
    } else {
      // Protected routes (order, transaction, chat)
      if (!isLoggedIn) {
        setShowAuth(true);
        setAuthMode('signin');
        setCurrentTab(tab);
        setShowProfile(false);
        setShowOrder(false);
        setShowTransaction(false);
        setShowChat(false);
        setShowForgotPassword(false);
        setShowOtpVerification(false);
        setShowNewPassword(false);
      } else {
        setCurrentTab(tab);
        setShowAuth(false);
        setShowProfile(false);
        setShowOrder(tab === 'order');
        setShowTransaction(tab === 'transaction');
        setShowChat(tab === 'chat');
        setShowForgotPassword(false);
        setShowOtpVerification(false);
        setShowNewPassword(false);
      }
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (authMode === 'signin') {
        // Sign In
        console.log('Attempting sign in with:', {
          email: authForm.email,
          password: authForm.password,
          type: 'customer'
        });
        
        console.log('API URL:', `${apiUrl}${login}`);
        
        const response = await fetch(`${apiUrl}${login}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            email: authForm.email,
            password: authForm.password,
            type: 'customer'
          }),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        // Check if response is ok
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          Alert.alert('Server Error', `Server returned ${response.status}: ${errorText.substring(0, 100)}`);
          return;
        }

        // Get response text first to debug
        const responseText = await response.text();
        console.log('Raw response:', responseText);

        // Try to parse JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          console.error('Response that failed to parse:', responseText);
          Alert.alert('Parse Error', 'Server returned invalid JSON. Please check the API endpoint.');
          return;
        }

        console.log('Parsed response data:', data);
        console.log('Response success:', data.success);
        console.log('Response token:', data.token ? 'Present' : 'Missing');
        console.log('Response user:', data.user ? 'Present' : 'Missing');
        
        if (data.success) {
          console.log('Login successful, setting auth token:', data.token ? 'Token received' : 'No token');
          console.log('Token value:', data.token ? `${data.token.substring(0, 30)}...` : 'No token');
          
          // Save token and user data to persistent storage
          if (data.token) {
            await saveToken(data.token);
          }
          if (data.user) {
            await saveUserData(data.user);
          }
          
          setIsLoggedIn(true);
          setUserData(data.user);
          setAuthToken(data.token);
          setShowAuth(false);
          setAuthForm({ fname: '', lname: '', email: '', password: '', confirmPassword: '', phone: '', code: '' });
          
          // Fetch all user data after successful login
          console.log('Login successful, fetching user data...');
          await fetchAllUserData(data.token);
          
          // Navigate to the intended protected screen
          if (redirectFromAuction) {
            // User was redirected from auction detail, go back to auction detail
            setRedirectFromAuction(false);
            setShowAuth(false);
            // The auction detail screen should still be visible
          } else if (currentTab === 'order') {
            setShowOrder(true);
          } else if (currentTab === 'transaction') {
            setShowTransaction(true);
          } else if (currentTab === 'chat') {
            setShowChat(true);
          }
        } else {
          Alert.alert('Error', data.message || 'Sign in failed');
        }
      } else if (authMode === 'signup') {
        // For signup, first send verification code
        await handleSendCode('signup');
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async (mode) => {
    if (!authForm.email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      if (mode === 'signup') {
        endpoint = `${apiUrl}${sendCode}`;
      } else if (mode === 'forgot-password') {
        endpoint = `${apiUrl}${forgotPassword}`;
      }

      console.log('Sending code for mode:', mode);
      console.log('Endpoint:', endpoint);
      console.log('Request body:', {
        email: authForm.email,
        type: 'customer'
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: authForm.email,
          type: 'customer'
        }),
      });

      console.log('Send code response status:', response.status);
      console.log('Send code response headers:', response.headers);

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Send code server error response:', errorText);
        Alert.alert('Server Error', `Server returned ${response.status}: ${errorText.substring(0, 100)}`);
        return;
      }

      // Get response text first to debug
      const responseText = await response.text();
      console.log('Send code raw response:', responseText);

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Send code JSON Parse Error:', parseError);
        console.error('Response that failed to parse:', responseText);
        Alert.alert('Parse Error', 'Server returned invalid JSON. Please check the API endpoint.');
        return;
      }

      console.log('Send code parsed response data:', data);
      
      if (data.success || data.message) {
        setOtpMode(mode);
        setShowOtpVerification(true);
        Alert.alert('Success', 'Verification code sent to your email');
      } else {
        Alert.alert('Error', data.message || 'Failed to send code');
      }
    } catch (error) {
      console.error('Send code error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!authForm.code) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      if (otpMode === 'signup') {
        endpoint = `${apiUrl}${verifyOtpRegistration}`;
      } else if (otpMode === 'forgot-password') {
        endpoint = `${apiUrl}${verifyOtpForgotPassword}`;
      }

      console.log('Verifying OTP for mode:', otpMode);
      console.log('Endpoint:', endpoint);
      console.log('Request body:', {
        email: authForm.email,
        code: authForm.code
      });

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(otpMode === 'forgot-password' && authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        body: JSON.stringify({
          email: authForm.email,
          code: authForm.code
        }),
      });

      console.log('Verify OTP response status:', response.status);

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Verify OTP server error response:', errorText);
        Alert.alert('Server Error', `Server returned ${response.status}: ${errorText.substring(0, 100)}`);
        return;
      }

      // Get response text first to debug
      const responseText = await response.text();
      console.log('Verify OTP raw response:', responseText);

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Verify OTP JSON Parse Error:', parseError);
        console.error('Response that failed to parse:', responseText);
        Alert.alert('Parse Error', 'Server returned invalid JSON. Please check the API endpoint.');
        return;
      }

      console.log('Verify OTP parsed response data:', data);
      
      if (data.success) {
        if (otpMode === 'signup') {
          // Store the verification code and return to signup form
          setAuthMode('signup');
          setShowOtpVerification(false);
          // Keep the code in authForm so it's available for signup
          Alert.alert('Success', 'Email verified! Please complete your registration.');
        } else if (otpMode === 'forgot-password') {
          // Proceed to new password
          setShowNewPassword(true);
          setShowOtpVerification(false);
        }
      } else {
        Alert.alert('Error', data.message || 'Invalid verification code');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!authForm.fname || !authForm.lname || !authForm.email || !authForm.password || !authForm.phone || !authForm.code) {
      Alert.alert('Error', 'Please fill all required fields including verification code');
      return;
    }

    if (authForm.password !== authForm.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting signup with:', {
        fname: authForm.fname,
        lname: authForm.lname,
        email: authForm.email,
        password: authForm.password,
        phone: authForm.phone,
        code: authForm.code
        // type is set by backend automatically
      });

      console.log('Signup endpoint:', `${apiUrl}${signup}`);

      const response = await fetch(`${apiUrl}${signup}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          fname: authForm.fname,
          lname: authForm.lname,
          email: authForm.email,
          password: authForm.password,
          phone: authForm.phone,
          code: authForm.code
          // Removed type field as it's not allowed in validation schema
        }),
      });

      console.log('Signup response status:', response.status);
      console.log('Signup response headers:', response.headers);

      // Check if response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Signup server error response:', errorText);
        Alert.alert('Server Error', `Server returned ${response.status}: ${errorText.substring(0, 100)}`);
        return;
      }

      // Get response text first to debug
      const responseText = await response.text();
      console.log('Signup raw response:', responseText);

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Signup JSON Parse Error:', parseError);
        console.error('Response that failed to parse:', responseText);
        Alert.alert('Parse Error', 'Server returned invalid JSON. Please check the API endpoint.');
        return;
      }

      console.log('Signup parsed response data:', data);
      console.log('Signup response success:', data.success);
      console.log('Signup response token:', data.token ? 'Present' : 'Missing');
      console.log('Signup response user:', data.user ? 'Present' : 'Missing');
      
      if (data.success) {
        console.log('Signup successful, setting auth token:', data.token ? 'Token received' : 'No token');
        
        // Save token and user data to persistent storage
        if (data.token) {
          await saveToken(data.token);
        }
        if (data.user) {
          await saveUserData(data.user);
        }
        
        setIsLoggedIn(true);
        setUserData(data.user);
        setAuthToken(data.token);
        setShowAuth(false);
        setAuthForm({ fname: '', lname: '', email: '', password: '', confirmPassword: '', phone: '', code: '' });
        Alert.alert('Success', 'Account created successfully');
        
        // Navigate to the intended protected screen
        if (currentTab === 'order') {
          setShowOrder(true);
        } else if (currentTab === 'transaction') {
          setShowTransaction(true);
        } else if (currentTab === 'chat') {
          setShowChat(true);
        }
      } else {
        Alert.alert('Error', data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!authForm.password || !authForm.confirmPassword) {
      Alert.alert('Error', 'Please fill all password fields');
      return;
    }

    if (authForm.password !== authForm.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}${updatePassword}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          password: authForm.password,
          code: authForm.code
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setShowNewPassword(false);
        setShowAuth(true);
        setAuthMode('signin');
        setAuthForm({ fname: '', lname: '', email: '', password: '', confirmPassword: '', phone: '', code: '' });
        Alert.alert('Success', 'Password updated successfully. Please sign in.');
      } else {
        Alert.alert('Error', data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Update password error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // Clear stored data
    await clearStoredData();
    
        // Clear local data
    setIsLoggedIn(false);
    setUserData(null);
    setAuthToken(null);
    setCurrentTab('home');
    setShowAuth(false);
    setShowProfile(false);
    setShowOrder(false);
    setShowTransaction(false);
    setShowChat(false);
    setShowForgotPassword(false);
    setShowOtpVerification(false);
    setShowNewPassword(false);
    setAuthForm({ fname: '', lname: '', email: '', password: '', confirmPassword: '', phone: '', code: '' });
    
    // Clear all fetched data
    setAuctionData([]);
    setOrderData([]);
    setTransactionData([]);
    setChatData([]);
    setAuctionError(null);
    setOrderError(null);
    setTransactionError(null);
    setChatError(null);
    
    Alert.alert('Success', 'Logged out successfully');
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${apiUrl}${deleteUser}`, {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                  'Authorization': `Bearer ${authToken}`
                },
              });

              const data = await response.json();
              
              if (data.success) {
                // Clear stored data
                await clearStoredData();
                
                setIsLoggedIn(false);
                setUserData(null);
                setAuthToken(null);
                setCurrentTab('home');
                setShowAuth(false);
                setShowProfile(false);
                setShowOrder(false);
                setShowTransaction(false);
                setShowChat(false);
                setShowForgotPassword(false);
                setShowOtpVerification(false);
                setShowNewPassword(false);
                setAuthForm({ fname: '', lname: '', email: '', password: '', confirmPassword: '', phone: '', code: '' });
                
                // Clear all fetched data
                setAuctionData([]);
                setOrderData([]);
                setTransactionData([]);
                setChatData([]);
                setAuctionError(null);
                setOrderError(null);
                setTransactionError(null);
                setChatError(null);
                
                Alert.alert('Success', 'Account deleted successfully');
              } else {
                Alert.alert('Error', data.message || 'Failed to delete account');
              }
            } catch (error) {
              console.error('Delete account error:', error);
              Alert.alert('Error', 'Network error. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleBack = () => {
    if (showNewPassword) {
      setShowNewPassword(false);
      setShowOtpVerification(true);
    } else if (showOtpVerification) {
      setShowOtpVerification(false);
      if (otpMode === 'signup') {
        setAuthMode('signup');
      } else {
        setShowForgotPassword(true);
      }
    } else if (showForgotPassword) {
      setShowForgotPassword(false);
      setShowAuth(true);
      setAuthMode('signin');
    } else if (showAuth) {
      setShowAuth(false);
      setCurrentTab('home');
    } else if (showProfile) {
      setShowProfile(false);
      setCurrentTab('home');
    } else if (showOrder) {
      setShowOrder(false);
      setCurrentTab('home');
    } else if (showTransaction) {
      setShowTransaction(false);
      setCurrentTab('home');
    } else if (showChat) {
      setShowChat(false);
      setCurrentTab('home');
            } else if (showCategoryAuctions) {
          setShowCategoryAuctions(false);
          setSelectedCategory('');
        } else if (showAuctionDetail) {
          setShowAuctionDetail(false);
          setSelectedAuction(null);
    }
  };

  const switchAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    setAuthForm({ fname: '', lname: '', email: '', password: '', confirmPassword: '', phone: '', code: '' });
  };

  const handleLanguageToggle = () => {
    setIsArabic(!isArabic);
  };

  const handleAuthFormChange = (field, value) => {
    setAuthForm(prev => ({ ...prev, [field]: value }));
  };

  const getUserDisplayName = () => {
    if (userData) {
      return `${userData.fname} ${userData.lname}`.trim() || userData.email;
    }
    return t('guest_user');
  };

  const getUserGreeting = () => {
    if (userData) {
      return `${t('welcome')}, ${userData.fname || userData.email}`;
    }
    return t('welcome');
  };

  // Render different screens based on state
  if (showAuth) {
    return (
      <AuthScreen
        onBack={handleBack}
        t={t}
        authMode={authMode}
        authForm={authForm}
        loading={loading}
        onAuthFormChange={handleAuthFormChange}
        onAuth={handleAuth}
        onSwitchAuthMode={switchAuthMode}
        onTabPress={handleTabPress}
        onForgotPassword={() => {
          setShowForgotPassword(true);
          setShowAuth(false);
        }}
        onSendCode={handleSendCode}
        onVerifyOtp={handleVerifyOtp}
        onSignup={handleSignup}
        onUpdatePassword={handleUpdatePassword}
        showForgotPassword={showForgotPassword}
        showOtpVerification={showOtpVerification}
        showNewPassword={showNewPassword}
        otpMode={otpMode}
      />
    );
  }

  if (showProfile) {
    return (
      <ProfileScreen
        onBack={handleBack}
        t={t}
        isArabic={isArabic}
        handleLanguageToggle={handleLanguageToggle}
        onTabPress={handleTabPress}
        userData={userData}
        getUserDisplayName={getUserDisplayName}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
        debugTokenStatus={debugTokenStatus}
        onShowAuth={() => {
          setShowAuth(true);
          setAuthMode('signin');
        }}
      />
    );
  }

  if (showOrder) {
    return (
      <OrderScreen
        onBack={handleBack}
        t={t}
        isArabic={isArabic}
        onTabPress={handleTabPress}
        orderData={orderData}
        orderLoading={orderLoading}
        orderError={orderError}
        refreshOrderData={refreshOrderData}
      />
    );
  }

  if (showTransaction) {
    return (
      <TransactionScreen
        onBack={handleBack}
        t={t}
        isArabic={isArabic}
        onTabPress={handleTabPress}
        transactionData={transactionData}
        transactionLoading={transactionLoading}
        transactionError={transactionError}
        refreshTransactionData={refreshTransactionData}
      />
    );
  }

  if (showChat) {
    return (
      <ChatScreen
        onBack={handleBack}
        t={t}
        isArabic={isArabic}
        onTabPress={handleTabPress}
        chatData={chatData}
        chatLoading={chatLoading}
        chatError={chatError}
        refreshChatData={refreshChatData}
      />
    );
  }

  if (showCategoryAuctions) {
    return (
      <CategoryAuctionsScreen
        onBack={handleBackFromCategoryAuctions}
        categoryName={selectedCategory}
        onAuctionPress={handleCategoryAuctionPress}
      />
    );
  }

  if (showAuctionDetail && selectedAuction) {
    return (
      <AuctionDetailScreen
        onBack={handleBackFromAuctionDetail}
        auction={selectedAuction}
        onPlaceBid={handlePlaceBid}
        onToggleFavorite={() => handleToggleFavorite(selectedAuction)}
        isFavorite={favoriteAuctions.some(fav => fav.id === selectedAuction.id)}
      />
    );
  }

  // Home Screen
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userData ? getUserDisplayName().charAt(0).toUpperCase() : 'G'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Hello, {getUserDisplayName()}</Text>
              <Text style={styles.userStatus}>Let's Start The Auction!</Text>
            </View>
          </View>
          {isLoggedIn ? (
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications" size={24} color="#2c3e50" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => {
                setShowAuth(true);
                setAuthMode('signin');
              }}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          )}
          </View>
        </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#95a5a6" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Abstract, Vehicles.."
            placeholderTextColor="#95a5a6"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Popular Types Section */}
        <View style={styles.section}>
            <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Types</Text>
            <TouchableOpacity onPress={() => handleExploreCategory('All Categories')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {auctionData && auctionData.length > 0 ? (
              // Show first 2 auctions as category cards
              auctionData.slice(0, 2).map((auction, index) => (
                <TouchableOpacity key={auction.id || index} style={styles.categoryCard}>
                  <View style={styles.categoryImage}>
                    {auction.image ? (
                      <Image 
                        source={{ uri: auction.image }} 
                        style={styles.categoryBackgroundImage}
                        resizeMode="cover"
                        onError={() => handleImageError(auction)}
                      />
                    ) : auction.images && auction.images.length > 0 ? (
                      <Image 
                        source={{ uri: auction.images[0] }} 
                        style={styles.categoryBackgroundImage}
                        resizeMode="cover"
                        onError={() => handleImageError(auction)}
                      />
                    ) : auction.lotImage ? (
                      <Image 
                        source={{ uri: auction.lotImage }} 
                        style={styles.categoryBackgroundImage}
                        resizeMode="cover"
                        onError={() => handleImageError(auction)}
                      />
                    ) : auction.lotImages && auction.lotImages.length > 0 ? (
                      <Image 
                        source={{ uri: auction.lotImages[0] }} 
                        style={styles.categoryBackgroundImage}
                        resizeMode="cover"
                        onError={() => handleImageError(auction)}
                      />
                    ) : (
                      <View style={index === 0 ? styles.abstractBackground : styles.vehicleBackground} />
                    )}
                  </View>
                  <View style={styles.categoryContent}>
                    <Text style={styles.categoryTitle}>
                      {auction.title || auction.name || auction.lotName || (index === 0 ? 'Abstract' : 'Vehicles')}
                    </Text>
                    <Text style={styles.categorySubtitle}>On everything today</Text>
                    <Text style={styles.categoryPrice}>
                      Start from Rp{(auction.startingPrice || auction.currentPrice || auction.price || auction.depositAmount || (index === 0 ? 200000 : 500000)).toLocaleString()}
                    </Text>
                    <TouchableOpacity 
                      style={styles.exploreButton}
                      onPress={() => handleExploreCategory(index === 0 ? 'Arts & Abstracts' : 'Vehicles')}
                    >
                      <Text style={styles.exploreButtonText}>Explore</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              // Fallback category cards when no auction data
              <>
                <TouchableOpacity style={styles.categoryCard}>
                  <View style={styles.categoryImage}>
                    <View style={styles.abstractBackground} />
                  </View>
                  <View style={styles.categoryContent}>
                    <Text style={styles.categoryTitle}>Abstract</Text>
                    <Text style={styles.categorySubtitle}>On everything today</Text>
                    <Text style={styles.categoryPrice}>Start from Rp200.000</Text>
                    <TouchableOpacity 
                      style={styles.exploreButton}
                      onPress={() => handleExploreCategory('Arts & Abstracts')}
                    >
                      <Text style={styles.exploreButtonText}>Explore</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.categoryCard}>
                  <View style={styles.categoryImage}>
                    <View style={styles.vehicleBackground} />
                  </View>
                  <View style={styles.categoryContent}>
                    <Text style={styles.categoryTitle}>Vehicles</Text>
                    <Text style={styles.categorySubtitle}>On everything today</Text>
                    <Text style={styles.categoryPrice}>Start from Rp500.000</Text>
                    <TouchableOpacity 
                      style={styles.exploreButton}
                      onPress={() => handleExploreCategory('Vehicles')}
                    >
                      <Text style={styles.exploreButtonText}>Explore</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>

        {/* Trending Now Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
            <TouchableOpacity onPress={() => handleExploreCategory('Trending')}>
              <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {auctionLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading auctions...</Text>
              </View>
            ) : auctionError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error loading auctions: {auctionError}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={refreshAuctionData}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : auctionData && auctionData.length > 0 ? (
            <View style={styles.trendingGrid}>
              {auctionData.slice(0, 4).map((auction, index) => (
                <TouchableOpacity 
                  key={auction.id || index} 
                  style={styles.trendingCard}
                  onPress={() => handleAuctionCardPress(auction)}
                >
                  <View style={styles.trendingImageContainer}>
                    {auction.image ? (
                      <Image 
                        source={{ uri: auction.image }} 
                        style={styles.trendingImage}
                        resizeMode="cover"
                        onError={() => handleImageError(auction)}
                      />
                    ) : auction.images && auction.images.length > 0 ? (
                      <Image 
                        source={{ uri: auction.images[0] }} 
                        style={styles.trendingImage}
                        resizeMode="cover"
                        onError={() => handleImageError(auction)}
                      />
                    ) : auction.lotImage ? (
                      <Image 
                        source={{ uri: auction.lotImage }} 
                        style={styles.trendingImage}
                        resizeMode="cover"
                        onError={() => handleImageError(auction)}
                      />
                    ) : auction.lotImages && auction.lotImages.length > 0 ? (
                      <Image 
                        source={{ uri: auction.lotImages[0] }} 
                        style={styles.trendingImage}
                        resizeMode="cover"
                        onError={() => handleImageError(auction)}
                      />
                    ) : (
                      <View style={styles.trendingImage}>
                        <Text style={styles.trendingImageText}>🏛️</Text>
                    </View>
                    )}
                    <TouchableOpacity style={styles.heartButton}>
                      <Ionicons name="heart-outline" size={16} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.trendingContent}>
                    <Text style={styles.trendingTitle} numberOfLines={2}>
                      {auction.title || auction.name || auction.lotName || 'Auction Item'}
                    </Text>
                    <Text style={styles.trendingPrice}>
                      Start From Rp{(auction.startingPrice || auction.currentPrice || auction.price || auction.depositAmount || 0).toLocaleString()}
                    </Text>
                    {auction.status && (
                      <Text style={styles.trendingStatus}>
                        {auction.status}
                    </Text>
                    )}
                  </View>
                  </TouchableOpacity>
                ))}
            </View>
            ) : (
              <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No trending auctions available.</Text>
              </View>
            )}
          </View>
      
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navItem, currentTab === 'home' && styles.navItemActive]} 
          onPress={() => handleTabPress('home')}
        >
          <Ionicons 
            name="home" 
            size={20} 
            color={currentTab === 'home' ? '#e74c3c' : '#95a5a6'} 
          />
          <Text style={[styles.navLabel, currentTab === 'home' && styles.navLabelActive]}>{t('home')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, currentTab === 'order' && styles.navItemActive]} 
          onPress={() => handleTabPress('order')}
        >
          <MaterialIcons 
            name="local-shipping" 
            size={20} 
            color={currentTab === 'order' ? '#e74c3c' : '#95a5a6'} 
          />
          <Text style={[styles.navLabel, currentTab === 'order' && styles.navLabelActive]}>{t('order')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, currentTab === 'transaction' && styles.navItemActive]} 
          onPress={() => handleTabPress('transaction')}
        >
          <FontAwesome5 
            name="money-bill-wave" 
            size={20} 
            color={currentTab === 'transaction' ? '#e74c3c' : '#95a5a6'} 
          />
          <Text style={[styles.navLabel, currentTab === 'transaction' && styles.navLabelActive]}>{t('transaction')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, currentTab === 'chat' && styles.navItemActive]} 
          onPress={() => handleTabPress('chat')}
        >
          <Ionicons 
            name="chatbubbles" 
            size={20} 
            color={currentTab === 'chat' ? '#e74c3c' : '#95a5a6'} 
          />
          <Text style={[styles.navLabel, currentTab === 'chat' && styles.navLabelActive]}>{t('chat')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navItem, currentTab === 'profile' && styles.navItemActive]} 
          onPress={() => handleTabPress('profile')}
        >
          <Ionicons 
            name="person" 
            size={20} 
            color={currentTab === 'profile' ? '#e74c3c' : '#95a5a6'} 
          />
          <Text style={[styles.navLabel, currentTab === 'profile' && styles.navLabelActive]}>{t('profile')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  
  // Header Styles
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
  },
  
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  avatarText: {
    fontSize: 24,
    color: '#ffffff',
  },
  
  userDetails: {
    flex: 1,
    minWidth: 0,
  },
  
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  
  userStatus: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loginButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loginButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  
  // Search Bar Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
  },
  
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
  },
  
  searchIcon: {
    marginRight: 10,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Main Content Styles
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  
  actionButtonLarge: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  
  actionButtonLargeText: {
    fontSize: 36,
    marginBottom: 5,
  },
  
  actionButtonLargeLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 8,
    textAlign: 'center',
  },
  
  section: {
    marginBottom: 25,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  
  viewAllText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
  },
  
  categoryScroll: {
    paddingVertical: 5,
  },
  
  categoryCard: {
    width: 280,
    height: 180,
    borderRadius: 16,
    marginRight: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  
  categoryImage: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  
  abstractBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3498db',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  
  vehicleBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2c3e50',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  
  categoryBackgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  
  categoryContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  
  categorySubtitle: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 8,
  },
  
  categoryPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  
  exploreButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  auctionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  noAuctionsText: {
    fontSize: 18,
    color: '#95a5a6',
    textAlign: 'center',
  },

  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  trendingCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  trendingImageContainer: {
    position: 'relative',
  },

  trendingImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  trendingImageText: {
    fontSize: 30,
  },

  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  trendingContent: {
    padding: 12,
  },

  trendingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 6,
    lineHeight: 18,
  },

  trendingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },

  trendingStatus: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
    textTransform: 'capitalize',
  },

  // Loading, Error, and Empty States
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
  },

  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },

  errorText: {
    fontSize: 14,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 10,
  },

  retryButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
  },
  
  // Bottom Navigation Styles
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  navIcon: {
    fontSize: 20,
    color: '#95a5a6',
    marginBottom: 4,
  },
  
  navLabel: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 6,
  },
  
  navItemActive: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  
  navIconActive: {
    color: '#e74c3c',
  },
  
  navLabelActive: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});
