import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const ChatScreen = ({ onBack, t, isArabic, onTabPress, chatData, chatLoading, chatError, refreshChatData }) => {
  const [searchText, setSearchText] = useState('');

  const renderChatContent = () => {
    if (chatLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Loading conversations...</Text>
        </View>
      );
    }

    if (chatError) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={50} color="#e74c3c" />
          <Text style={styles.errorTitle}>Error Loading Chats</Text>
          <Text style={styles.errorMessage}>{chatError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshChatData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!chatData || chatData.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyStateIcon}>
            <View style={styles.messageCard}>
              <Text style={styles.briefcaseIcon}>💼</Text>
              <View style={styles.textLines}>
                <View style={styles.textLine1} />
                <View style={styles.textLine2} />
              </View>
            </View>
          </View>
          <Text style={styles.emptyStateTitle}>You Have Not Received</Text>
          <Text style={styles.emptyStateSubtitle}>Any Messages</Text>
          <Text style={styles.emptyStateDescription}>All messages will appear here</Text>
        </View>
      );
    }

    // Filter conversations based on search text
    const filteredChats = chatData.filter(chat => 
      chat.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      chat.lastMessage?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
      <ScrollView style={styles.chatListContainer}>
        {filteredChats.map((chat, index) => (
          <TouchableOpacity key={chat.id || index} style={styles.chatItem}>
            <View style={styles.chatAvatar}>
              <Text style={styles.chatAvatarText}>
                {chat.title?.charAt(0)?.toUpperCase() || 'C'}
              </Text>
            </View>
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>{chat.title || 'Conversation'}</Text>
                <Text style={styles.chatTime}>{chat.lastMessageTime || 'Now'}</Text>
              </View>
              <Text style={styles.chatLastMessage} numberOfLines={2}>
                {chat.lastMessage || 'No messages yet'}
              </Text>
            </View>
            {chat.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, isArabic && styles.rtlContainer]}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshChatData}>
          <Ionicons name="refresh" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#95a5a6" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages"
            placeholderTextColor="#95a5a6"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Chat List */}
      {renderChatContent()}

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
          <Ionicons name="chatbubbles" size={20} color="#e74c3c" />
          <Text style={[styles.navLabel, { color: '#e74c3c', fontWeight: 'bold' }]}>{t('chat')}</Text>
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
    paddingTop: 20,
  },
  
  rtlContainer: {
    direction: 'rtl',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  
  headerSpacer: {
    width: 40,
  },
  
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
  
  // Search Bar Styles
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  searchIcon: {
    marginRight: 12,
  },
  
  searchIconText: {
    fontSize: 16,
    color: '#ffffff',
  },
  
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  
  // Chat List Styles
  chatListContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  chatAvatarText: {
    fontSize: 20,
    color: '#2c3e50',
    fontWeight: 'bold',
  },

  chatContent: {
    flex: 1,
  },

  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

  chatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },

  chatTime: {
    fontSize: 12,
    color: '#95a5a6',
  },

  chatLastMessage: {
    fontSize: 14,
    color: '#555',
  },

  unreadBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  emptyStateIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  
  messageCard: {
    width: 60,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  briefcaseIcon: {
    fontSize: 16,
    color: '#95a5a6',
    marginBottom: 2,
  },
  
  textLines: {
    alignItems: 'center',
  },
  
  textLine1: {
    width: 30,
    height: 2,
    backgroundColor: '#bdc3c7',
    marginBottom: 2,
    borderRadius: 1,
  },
  
  textLine2: {
    width: 20,
    height: 2,
    backgroundColor: '#bdc3c7',
    borderRadius: 1,
  },
  
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  
  emptyStateSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  
  emptyStateDescription: {
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
  },

  // Loading and Error Styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#95a5a6',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },

  errorMessage: {
    fontSize: 16,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
});

export default ChatScreen; 