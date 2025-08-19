import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const AuthScreen = ({ 
  onBack, 
  t, 
  authMode, 
  authForm, 
  loading, 
  onAuthFormChange, 
  onAuth, 
  onSwitchAuthMode, 
  onTabPress,
  onForgotPassword,
  onSendCode,
  onVerifyOtp,
  onSignup,
  onUpdatePassword,
  showForgotPassword,
  showOtpVerification,
  showNewPassword,
  otpMode
}) => {
  const renderSignInForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder={t('email')}
        value={authForm.email}
        onChangeText={(text) => onAuthFormChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={t('password')}
        value={authForm.password}
        onChangeText={(text) => onAuthFormChange('password', text)}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.forgotPasswordButton} onPress={onForgotPassword}>
        <Text style={styles.forgotPasswordText}>{t('forgot_password')}</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.authButton, loading && styles.authButtonDisabled]} 
        onPress={onAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.authButtonText}>{t('sign_in')}</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.switchModeButton} onPress={onSwitchAuthMode}>
        <Text style={styles.switchModeText}>
          {t('sign_up')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderSignUpForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder={t('first_name')}
        value={authForm.fname}
        onChangeText={(text) => onAuthFormChange('fname', text)}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder={t('last_name')}
        value={authForm.lname}
        onChangeText={(text) => onAuthFormChange('lname', text)}
        autoCapitalize="words"
      />
      <TextInput
        style={styles.input}
        placeholder={t('email')}
        value={authForm.email}
        onChangeText={(text) => onAuthFormChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={t('phone')}
        value={authForm.phone}
        onChangeText={(text) => onAuthFormChange('phone', text)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder={t('password')}
        value={authForm.password}
        onChangeText={(text) => onAuthFormChange('password', text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder={t('confirm_password')}
        value={authForm.confirmPassword}
        onChangeText={(text) => onAuthFormChange('confirmPassword', text)}
        secureTextEntry
      />
      
      {/* Show verification code field if code exists (after OTP verification) */}
      {authForm.code && (
        <TextInput
          style={styles.input}
          placeholder={t('verification_code')}
          value={authForm.code}
          onChangeText={(text) => onAuthFormChange('code', text)}
          keyboardType="numeric"
          maxLength={6}
          editable={false}
        />
      )}
      
      <TouchableOpacity 
        style={[styles.authButton, loading && styles.authButtonDisabled]} 
        onPress={authForm.code ? onSignup : onAuth}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.authButtonText}>
            {authForm.code ? t('sign_up') : t('send_code')}
          </Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.switchModeButton} onPress={onSwitchAuthMode}>
        <Text style={styles.switchModeText}>
          {t('sign_in')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderForgotPasswordForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{t('forgot_password')}</Text>
      <Text style={styles.formSubtitle}>Enter your email to receive a verification code</Text>
      
      <TextInput
        style={styles.input}
        placeholder={t('email')}
        value={authForm.email}
        onChangeText={(text) => onAuthFormChange('email', text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TouchableOpacity 
        style={[styles.authButton, loading && styles.authButtonDisabled]} 
        onPress={() => onSendCode('forgot-password')}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.authButtonText}>{t('send_code')}</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>{t('back_to_login')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderOtpVerificationForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{t('verification_code')}</Text>
      <Text style={styles.formSubtitle}>
        {otpMode === 'signup' 
          ? 'Enter the verification code sent to your email' 
          : 'Enter the verification code to reset your password'
        }
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder={t('verification_code')}
        value={authForm.code}
        onChangeText={(text) => onAuthFormChange('code', text)}
        keyboardType="numeric"
        maxLength={6}
      />
      
      <TouchableOpacity 
        style={[styles.authButton, loading && styles.authButtonDisabled]} 
        onPress={onVerifyOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.authButtonText}>{t('verify_code')}</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.resendButton} 
        onPress={() => onSendCode(otpMode)}
        disabled={loading}
      >
        <Text style={styles.resendButtonText}>Resend Code</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNewPasswordForm = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{t('new_password')}</Text>
      <Text style={styles.formSubtitle}>Enter your new password</Text>
      
      <TextInput
        style={styles.input}
        placeholder={t('new_password')}
        value={authForm.password}
        onChangeText={(text) => onAuthFormChange('password', text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder={t('confirm_password')}
        value={authForm.confirmPassword}
        onChangeText={(text) => onAuthFormChange('confirmPassword', text)}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={[styles.authButton, loading && styles.authButtonDisabled]} 
        onPress={onUpdatePassword}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.authButtonText}>{t('update_password')}</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (showNewPassword) {
      return renderNewPasswordForm();
    } else if (showOtpVerification) {
      return renderOtpVerificationForm();
    } else if (showForgotPassword) {
      return renderForgotPasswordForm();
    } else if (authMode === 'signup') {
      return renderSignUpForm();
    } else {
      return renderSignInForm();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {showNewPassword ? t('new_password') :
           showOtpVerification ? t('verification_code') :
           showForgotPassword ? t('forgot_password') :
           authMode === 'signup' ? t('sign_up') : t('sign_in')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Main Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => onTabPress('home')}>
          <Ionicons name="home" size={20} color="#95a5a6" />
          <Text style={styles.navLabel}>{t('home')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => onTabPress('order')}>
          <MaterialIcons name="local-shipping" size={20} color="#95a5a6" />
          <Text style={styles.navLabel}>{t('order')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => onTabPress('transaction')}>
          <FontAwesome5 name="money-bill-wave" size={20} color="#95a5a6" />
          <Text style={styles.navLabel}>{t('transaction')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => onTabPress('chat')}>
          <Ionicons name="chatbubbles" size={20} color="#95a5a6" />
          <Text style={styles.navLabel}>{t('chat')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => onTabPress('profile')}>
          <Ionicons name="person" size={20} color="#95a5a6" />
          <Text style={styles.navLabel}>{t('profile')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  
  backIcon: {
    fontSize: 20,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  
  headerSpacer: {
    width: 34,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  formContainer: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  
  formSubtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 30,
    textAlign: 'center',
  },
  
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f8f9fa',
  },
  
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  
  forgotPasswordText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  
  authButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  
  authButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  
  authButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  switchModeButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  
  switchModeText: {
    color: '#e74c3c',
    fontSize: 16,
  },
  
  resendButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 15,
  },
  
  resendButtonText: {
    color: '#3498db',
    fontSize: 14,
  },
  
  backButtonText: {
    color: '#7f8c8d',
    fontSize: 16,
    textAlign: 'center',
  },
  
  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
  },
  
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  
  navLabel: {
    fontSize: 10,
    color: '#95a5a6',
    marginTop: 6,
  },
});

export default AuthScreen; 