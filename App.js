import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import TransactionScreen from './TransactionScreen';
import OrderScreen from './OrderScreen';
import ProfileScreen from './ProfileScreen';
import AuthScreen from './AuthScreen';
import ChatScreen from './ChatScreen';
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
  getUserOrders,
  getUserInvoices,
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

  // Data fetching functions with error handling and fallbacks
  const fetchAuctionData = async (token = authToken) => {
    if (!token) {
      console.log('No auth token available for auction data fetch');
      return;
    }

    setAuctionLoading(true);
    setAuctionError(null);
    
    try {
      console.log('Fetching auction data...');
      console.log('Endpoint:', `${apiUrl}${getAllAuctionUsingPaging}1`); // Page 1
      
      const response = await fetch(`${apiUrl}${getAllAuctionUsingPaging}1`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Auction response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Auction API error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log('Auction data received:', data);
      
      if (data.success && data.data) {
        setAuctionData(data.data);
      } else {
        setAuctionData([]);
        console.warn('Auction API returned no data or success: false');
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

  const fetchOrderData = async (token = authToken) => {
    if (!token) {
      console.log('No auth token available for order data fetch');
      return;
    }

    setOrderLoading(true);
    setOrderError(null);
    
    try {
      console.log('Fetching order data...');
      console.log('Token being used:', token ? `${token.substring(0, 20)}...` : 'No token');
      console.log('Endpoint:', `${apiUrl}${getUser}`);
      
      const response = await fetch(`${apiUrl}${getUser}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Order response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Order API error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log('Order data received:', data);
      
      if (data.success && data.data) {
        // Check if the user data includes orders
        if (data.data.orders) {
          setOrderData(data.data.orders);
        } else if (data.data.invoices) {
          setOrderData(data.data.invoices);
        } else {
          // If no orders in user data, try the user orders endpoint
          console.log('No orders in user data, trying user orders endpoint...');
          await fetchUserOrders(token);
        }
      } else {
        setOrderData([]);
        console.warn('Order API returned no data or success: false');
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

  const fetchUserOrders = async (token) => {
    try {
      console.log('Trying user orders endpoint:', `${apiUrl}${getUserOrders}`);
      
      const response = await fetch(`${apiUrl}${getUserOrders}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setOrderData(data.data);
          return;
        }
      }
      
      // If user orders endpoint doesn't work, try user invoices
      console.log('User orders failed, trying user invoices endpoint...');
      await fetchUserInvoices(token);
      
    } catch (error) {
      console.error('User orders fetch error:', error);
      // Try user invoices as fallback
      await fetchUserInvoices(token);
    }
  };

  const fetchUserInvoices = async (token) => {
    try {
      console.log('Trying user invoices endpoint:', `${apiUrl}${getUserInvoices}`);
      
      const response = await fetch(`${apiUrl}${getUserInvoices}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setOrderData(data.data);
          return;
        }
      }
      
      // If all endpoints fail, set empty data
      console.log('All user order endpoints failed, setting empty data');
      setOrderData([]);
      
    } catch (error) {
      console.error('User invoices fetch error:', error);
      setOrderData([]);
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
        const errorText = await response.text();
        console.error('Transaction API error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log('Transaction data received:', data);
      
      if (data.success && data.data) {
        setTransactionData(data.data);
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
    if (!token) {
      console.log('No auth token available for chat data fetch');
      return;
    }

    setChatLoading(true);
    setChatError(null);
    
    try {
      console.log('Fetching chat data...');
      console.log('Endpoint:', `${apiUrl}${getAllConversation}`);
      
      const response = await fetch(`${apiUrl}${getAllConversation}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Chat response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Chat API error:', errorText);
        throw new Error(`Server error: ${response.status} - ${errorText.substring(0, 100)}`);
      }

      const data = await response.json();
      console.log('Chat data received:', data);
      
      if (data.success && data.data) {
        setChatData(data.data);
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
    await Promise.allSettled([
      fetchAuctionData(token),
      fetchOrderData(token),
      fetchTransactionData(token),
      fetchChatData(token)
    ]);
    
    console.log('All user data fetch completed');
  };

  // Refresh functions for each screen
  const refreshAuctionData = () => {
    console.log('Refreshing auction data...');
    fetchAuctionData(authToken);
  };

  const refreshOrderData = () => {
    console.log('Refreshing order data...');
    fetchOrderData(authToken);
  };

  const refreshTransactionData = () => {
    console.log('Refreshing transaction data...');
    fetchTransactionData(authToken);
  };

  const refreshChatData = () => {
    console.log('Refreshing chat data...');
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
      // Protected routes
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
        
        if (data.success) {
          console.log('Login successful, setting auth token:', data.token ? 'Token received' : 'No token');
          console.log('Token value:', data.token ? `${data.token.substring(0, 30)}...` : 'No token');
          setIsLoggedIn(true);
          setUserData(data.user);
          setAuthToken(data.token);
          setShowAuth(false);
          setAuthForm({ fname: '', lname: '', email: '', password: '', confirmPassword: '', phone: '', code: '' });
          
          // Fetch all user data after successful login
          console.log('Login successful, fetching user data...');
          await fetchAllUserData(data.token);
          
          // Navigate to the intended protected screen
          if (currentTab === 'order') {
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
      
      if (data.success) {
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
              <Text style={styles.userName}>{getUserGreeting()}</Text>
              <Text style={styles.userStatus}>
                {userData ? userData.email : t('guest_user')}
              </Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleTabPress('profile')}>
              <Ionicons name="person" size={20} color="#e74c3c" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { marginLeft: 10 }]} onPress={handleLanguageToggle}>
              <Text style={styles.actionButtonText}>{isArabic ? 'EN' : 'عربي'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Recent Auctions Section */}
        {isLoggedIn && auctionData && auctionData.length > 0 && (
          <View style={styles.auctionSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Auctions</Text>
              <TouchableOpacity onPress={refreshAuctionData}>
                <Ionicons name="refresh" size={20} color="#e74c3c" />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.auctionScroll}>
              {auctionData.slice(0, 5).map((auction, index) => (
                <TouchableOpacity key={auction.id || index} style={styles.auctionCard}>
                  <View style={styles.auctionImage}>
                    <Text style={styles.auctionImageText}>🏛️</Text>
                  </View>
                  <Text style={styles.auctionTitle} numberOfLines={2}>
                    {auction.title || 'Auction Item'}
                  </Text>
                  <Text style={styles.auctionPrice}>
                    ${auction.startingPrice || auction.currentPrice || '0.00'}
                  </Text>
                  <Text style={styles.auctionStatus}>
                    {auction.status || 'Active'}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        
      
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
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
  
  headerActions: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e74c3c',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  
  actionButtonText: {
    fontSize: 16,
    color: '#e74c3c',
  },
  
  // Main Content Styles
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
    marginBottom: 20,
  },
  
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  
  viewAllText: {
    fontSize: 14,
    color: '#7f8c8d',
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

  auctionSection: {
    marginBottom: 20,
  },

  auctionScroll: {
    paddingVertical: 10,
  },

  auctionCard: {
    width: 200,
    height: 250,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginRight: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  auctionImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  auctionImageText: {
    fontSize: 40,
  },

  auctionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 5,
  },

  auctionPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },

  auctionStatus: {
    fontSize: 14,
    color: '#7f8c8d',
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
