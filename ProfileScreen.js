import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Switch, Alert, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const ProfileScreen = ({ onBack, t, isArabic, onTabPress, userData, getUserDisplayName, onLogout, onDeleteAccount, debugTokenStatus, onShowAuth }) => {
  const [localIsArabic, setLocalIsArabic] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [personalInfoForm, setPersonalInfoForm] = useState({
    firstName: userData?.fname || '',
    lastName: userData?.lname || '',
    phone: userData?.phone || '',
    email: userData?.email || ''
  });

  useEffect(() => {
    if (userData) {
      setPersonalInfoForm({
        firstName: userData.fname || '',
        lastName: userData.lname || '',
        phone: userData.phone || '',
        email: userData.email || ''
      });
    }
  }, [userData]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: onLogout, style: 'destructive' }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: onDeleteAccount, style: 'destructive' }
      ]
    );
  };

  const handleLanguageToggle = () => {
    setLocalIsArabic(!localIsArabic);
  };

  const handleSaveChanges = () => {
    // Here you would typically save the changes to the backend
    Alert.alert('Success', 'Personal information updated successfully!');
    setShowPersonalInfo(false);
  };

  const renderPersonalInfoScreen = () => (
    <SafeAreaView style={[styles.container, localIsArabic && styles.rtlContainer]}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setShowPersonalInfo(false)}>
          <Ionicons name="arrow-back" size={20} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Information</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Profile Picture Section */}
      <View style={styles.profilePictureSection}>
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture}>
            <Ionicons name="person" size={60} color="#95a5a6" />
          </View>
          <TouchableOpacity style={styles.cameraButton}>
            <Ionicons name="camera" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Input Fields */}
      <View style={styles.inputFieldsContainer}>
        <View style={styles.inputField}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={styles.textInput}
            value={personalInfoForm.firstName}
            onChangeText={(text) => setPersonalInfoForm({...personalInfoForm, firstName: text})}
            placeholder="First Name"
            placeholderTextColor="#95a5a6"
          />
        </View>

        <View style={styles.inputField}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            style={styles.textInput}
            value={personalInfoForm.lastName}
            onChangeText={(text) => setPersonalInfoForm({...personalInfoForm, lastName: text})}
            placeholder="Last Name"
            placeholderTextColor="#95a5a6"
          />
        </View>

        <View style={styles.inputField}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.textInput}
            value={personalInfoForm.phone}
            onChangeText={(text) => setPersonalInfoForm({...personalInfoForm, phone: text})}
            placeholder="Phone Number"
            placeholderTextColor="#95a5a6"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputField}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.textInput}
            value={personalInfoForm.email}
            onChangeText={(text) => setPersonalInfoForm({...personalInfoForm, email: text})}
            placeholder="Email Address"
            placeholderTextColor="#95a5a6"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Save Changes Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>

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
          <Ionicons name="person" size={20} color="#e74c3c" />
          <Text style={[styles.navLabel, { color: '#e74c3c', fontWeight: 'bold' }]}>{t('profile')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // Show Personal Information screen if active
  if (showPersonalInfo) {
    return renderPersonalInfoScreen();
  }

  return (
    <SafeAreaView style={[styles.container, localIsArabic && styles.rtlContainer]}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.profileTitle}>{t('profileMore')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Profile Content */}
      <ScrollView style={styles.profileContainer}>
        {/* User Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.profileAvatar}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          {userData ? (
            <>
              <Text style={styles.userName}>{getUserDisplayName()}</Text>
              {userData.email && (
                <Text style={styles.userEmail}>{userData.email}</Text>
              )}
              {userData.type && (
                <Text style={styles.userType}>Account Type: {userData.type}</Text>
              )}
            </>
          ) : (
            <>
              <Text style={styles.userName}>Guest User</Text>
              <Text style={styles.userEmail}>Please login to access your profile</Text>
            </>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {userData ? (
            <>
              <TouchableOpacity style={styles.menuItem} onPress={() => setShowPersonalInfo(true)}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="person" size={20} color="#7f8c8d" />
                </View>
                <Text style={styles.menuText}>{t('personalInformation')}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="heart" size={20} color="#7f8c8d" />
                </View>
                <Text style={styles.menuText}>{t('favorites')}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="trophy" size={20} color="#7f8c8d" />
                </View>
                <Text style={styles.menuText}>{t('wonLots')}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="settings" size={20} color="#7f8c8d" />
                </View>
                <Text style={styles.menuText}>{t('settings')}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="currency-exchange" size={20} color="#7f8c8d" />
                </View>
                <Text style={styles.menuText}>{t('currencySettings')}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <View style={[styles.menuItem, styles.disabledMenuItem]}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="person" size={20} color="#bdc3c7" />
                </View>
                <Text style={[styles.menuText, styles.disabledMenuText]}>{t('personalInformation')}</Text>
                <Text style={[styles.menuArrow, styles.disabledMenuText]}>›</Text>
              </View>

              <View style={[styles.menuItem, styles.disabledMenuItem]}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="heart" size={20} color="#bdc3c7" />
                </View>
                <Text style={[styles.menuText, styles.disabledMenuText]}>{t('favorites')}</Text>
                <Text style={[styles.menuArrow, styles.disabledMenuText]}>›</Text>
              </View>

              <View style={[styles.menuItem, styles.disabledMenuItem]}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="trophy" size={20} color="#bdc3c7" />
                </View>
                <Text style={[styles.menuText, styles.disabledMenuText]}>{t('wonLots')}</Text>
                <Text style={[styles.menuArrow, styles.disabledMenuText]}>›</Text>
              </View>

              <View style={[styles.menuItem, styles.disabledMenuItem]}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="settings" size={20} color="#bdc3c7" />
                </View>
                <Text style={[styles.menuText, styles.disabledMenuText]}>{t('settings')}</Text>
                <Text style={[styles.menuArrow, styles.disabledMenuText]}>›</Text>
              </View>

              <View style={[styles.menuItem, styles.disabledMenuItem]}>
                <View style={styles.menuIconContainer}>
                  <Ionicons name="currency-exchange" size={20} color="#bdc3c7" />
                </View>
                <Text style={[styles.menuText, styles.disabledMenuText]}>{t('currencySettings')}</Text>
                <Text style={[styles.menuArrow, styles.disabledMenuText]}>›</Text>
              </View>
            </>
          )}

          <View style={styles.menuItem}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="globe" size={20} color="#7f8c8d" />
            </View>
            <Text style={styles.menuText}>{localIsArabic ? t('arabic') : t('english')}</Text>
            <Switch
              value={localIsArabic}
              onValueChange={handleLanguageToggle}
              trackColor={{ false: '#767577', true: '#e74c3c' }}
              thumbColor={localIsArabic ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          {/* Debug Button - Only show in development */}
          <TouchableOpacity style={styles.menuItem} onPress={debugTokenStatus}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="bug" size={20} color="#e74c3c" />
            </View>
            <Text style={[styles.menuText, { color: '#e74c3c' }]}>Debug Token Status</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        {userData ? (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.logoutButtonText}>Logout Account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={() => {
                onShowAuth && onShowAuth();
              }}
            >
              <Text style={styles.loginButtonText}>Login to Your Account</Text>
            </TouchableOpacity>
          </View>
        )}
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
          <Ionicons name="person" size={20} color="#e74c3c" />
          <Text style={[styles.navLabel, { color: '#e74c3c', fontWeight: 'bold' }]}>{t('profile')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  
  rtlContainer: {
    direction: 'rtl',
  },
  
  // Profile Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  
  profileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  
  headerSpacer: {
    width: 40,
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
  
  profileContainer: {
    flex: 1,
  },
  
  avatarContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2c3e50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  
  avatarIcon: {
    fontSize: 40,
    color: '#ffffff',
  },
  
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  
  userEmail: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  
  userType: {
    fontSize: 12,
    color: '#95a5a6',
    textTransform: 'capitalize',
  },
  
  menuContainer: {
    paddingHorizontal: 20,
  },
  
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  
  menuIconContainer: {
    width: 30,
    textAlign: 'center',
    marginRight: 15,
  },
  
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#7f8c8d',
    marginLeft: 5,
  },
  
  menuArrow: {
    fontSize: 18,
    color: '#bdc3c7',
    marginLeft: 10,
  },

  // Action Buttons Styles
  actionButtonsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  
  logoutButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  deleteButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  deleteButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  loginButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  disabledMenuItem: {
    opacity: 0.5,
  },
  
  disabledMenuText: {
    color: '#bdc3c7',
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
  
  navText: {
    fontSize: 12,
    color: '#95a5a6',
  },
  
  activeNavIcon: {
    color: '#e74c3c',
  },
  
  activeNavText: {
    color: '#e74c3c',
  },

  navLabel: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 6,
  },

  // Personal Info Screen Styles
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  profilePictureSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },

  profilePictureContainer: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#34495e',
  },

  profilePicture: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34495e',
  },

  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#27ae60',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },

  inputFieldsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  inputField: {
    marginBottom: 15,
  },

  inputLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },

  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
    backgroundColor: '#ffffff',
  },

  saveButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  saveButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen; 