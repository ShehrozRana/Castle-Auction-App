import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const TransactionScreen = ({ onBack, t, isArabic, onTabPress, transactionData, transactionLoading, transactionError, refreshTransactionData }) => {
  const [currentView, setCurrentView] = useState('main'); // 'main', 'history', 'refund'
  const [currentBalance] = useState(0);

  const handleBack = () => {
    if (currentView === 'main') {
      onBack();
    } else {
      setCurrentView('main');
    }
  };

  const renderTransactionContent = () => {
    if (transactionLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      );
    }

    if (transactionError) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={50} color="#e74c3c" />
          <Text style={styles.errorTitle}>Error Loading Transactions</Text>
          <Text style={styles.errorMessage}>{transactionError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshTransactionData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!transactionData || transactionData.length === 0) {
      return (
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIcon}>
            <Text style={styles.emptyStateIconText}>📋</Text>
          </View>
          <Text style={styles.emptyStateText}>No Transaction History Found</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.transactionListContainer}>
        {transactionData.map((transaction, index) => (
          <View key={transaction.id || index} style={styles.transactionItem}>
            <View style={styles.transactionHeader}>
              <Text style={styles.transactionId}>TXN #{transaction.transactionId || transaction.id}</Text>
              <Text style={[styles.transactionStatus, { color: getTransactionStatusColor(transaction.status) }]}>
                {transaction.status || 'Pending'}
              </Text>
            </View>
            <Text style={styles.transactionTitle}>{transaction.title || 'Payment Transaction'}</Text>
            <Text style={styles.transactionDate}>{transaction.createdAt || 'Date not available'}</Text>
            <Text style={[styles.transactionAmount, { color: transaction.type === 'credit' ? '#27ae60' : '#e74c3c' }]}>
              {transaction.type === 'credit' ? '+' : '-'}${transaction.amount || '0.00'}
            </Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  const getTransactionStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#27ae60';
      case 'pending': return '#f39c12';
      case 'failed': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const renderMainView = () => (
    <View style={styles.mainContainer}>
      {/* Header with Red Background */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment & Deposits</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshTransactionData}>
          <Ionicons name="refresh" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      {/* Balance Section */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceAmount}>${currentBalance}</Text>
        <Text style={styles.balanceLabel}>Current Deposit Balance</Text>
      </View>

      {/* White Card Section */}
      <View style={styles.whiteCard}>
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setCurrentView('history')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>🕐</Text>
            </View>
            <Text style={styles.actionButtonText}>Payment History</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => setCurrentView('refund')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}>💸</Text>
            </View>
            <Text style={styles.actionButtonText}>Refund Requests</Text>
          </TouchableOpacity>
        </View>

        {/* Empty State */}
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIcon}>
            <Text style={styles.emptyStateIconText}>📋</Text>
          </View>
          <Text style={styles.emptyStateText}>No History Found</Text>
        </View>
      </View>
    </View>
  );

  const renderHistoryView = () => (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment History</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* History Content */}
      <View style={styles.contentContainer}>
        {renderTransactionContent()}
      </View>
    </View>
  );

  const renderRefundView = () => (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={20} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refund Requests</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Refund Content */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.emptyState}>
          <View style={styles.emptyStateIcon}>
            <Text style={styles.emptyStateIconText}>💸</Text>
          </View>
          <Text style={styles.emptyStateText}>No Refund Requests Found</Text>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isArabic && styles.rtlContainer]}>
      <StatusBar style="light" />
      
      {currentView === 'main' && renderMainView()}
      {currentView === 'history' && renderHistoryView()}
      {currentView === 'refund' && renderRefundView()}

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
          <FontAwesome5 name="money-bill-wave" size={20} color="#e74c3c" />
          <Text style={[styles.navLabel, { color: '#e74c3c', fontWeight: 'bold' }]}>{t('transaction')}</Text>
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
    backgroundColor: '#e74c3c',
  },
  
  rtlContainer: {
    direction: 'rtl',
  },
  
  mainContainer: {
    flex: 1,
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
  
  // Balance Section
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  
  balanceAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  
  balanceLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  
  // White Card Section
  whiteCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 30,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginBottom: 30,
  },
  
  actionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  
  actionIconText: {
    fontSize: 24,
    color: '#ffffff',
  },
  
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    textAlign: 'center',
    marginTop: 8,
  },
  
  // Content Container for History/Refund views
  contentContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingTop: 30,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  
  // Empty State
  emptyState: {
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
    marginBottom: 20,
  },
  
  emptyStateIconText: {
    fontSize: 50,
    color: '#bdc3c7',
  },
  
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
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

  // New styles for transaction data
  transactionListContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  transactionItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

  transactionId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34495e',
  },

  transactionStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },

  transactionDate: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 5,
  },

  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#34495e',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 10,
  },

  errorMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionScreen; 