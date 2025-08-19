import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const OrderScreen = ({ onBack, t, isArabic, onTabPress, orderData, orderLoading, orderError, refreshOrderData }) => {
  const [orderFilter, setOrderFilter] = useState('all'); // 'all', 'shipped', 'transit', 'delivered'

  const handleOrderFilter = (filter) => {
    setOrderFilter(filter);
  };

  const renderOrderContent = () => {
    if (orderLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      );
    }

    if (orderError) {
      return (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={50} color="#e74c3c" />
          <Text style={styles.errorTitle}>Error Loading Orders</Text>
          <Text style={styles.errorMessage}>{orderError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshOrderData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (!orderData || orderData.length === 0) {
      return (
        <View style={styles.emptyOrderState}>
          <View style={styles.emptyOrderIcon}>
            <Text style={styles.emptyOrderIconText}>📋</Text>
          </View>
          <Text style={styles.emptyOrderText}>{t('noOrdersFound')}</Text>
        </View>
      );
    }

    // Filter orders based on selected filter
    const filteredOrders = orderData.filter(order => {
      if (orderFilter === 'all') return true;
      return order.status === orderFilter;
    });

    return (
      <ScrollView style={styles.orderListContainer}>
        {filteredOrders.map((order, index) => (
          <View key={order.id || index} style={styles.orderItem}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Order #{order.orderId || order.id}</Text>
              <Text style={[styles.orderStatus, { color: getStatusColor(order.status) }]}>
                {order.status || 'Pending'}
              </Text>
            </View>
            <Text style={styles.orderTitle}>{order.title || 'Auction Item'}</Text>
            <Text style={styles.orderDate}>{order.createdAt || 'Date not available'}</Text>
            <Text style={styles.orderAmount}>${order.amount || '0.00'}</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'shipped': return '#27ae60';
      case 'transit': return '#f39c12';
      case 'delivered': return '#2ecc71';
      default: return '#95a5a6';
    }
  };

  return (
    <SafeAreaView style={[styles.container, isArabic && styles.rtlContainer]}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.orderTitle}>{t('orderTracking')}</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshOrderData}>
          <Ionicons name="refresh" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>

      {/* Order Filter Tabs */}
      <View style={styles.filterTabs}>
        <TouchableOpacity 
          style={[styles.filterTab, orderFilter === 'all' && styles.activeFilterTab]}
          onPress={() => handleOrderFilter('all')}
        >
          <Text style={[styles.filterTabText, orderFilter === 'all' && styles.activeFilterTabText]}>
            {t('all')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, orderFilter === 'shipped' && styles.activeFilterTab]}
          onPress={() => handleOrderFilter('shipped')}
        >
          <Text style={[styles.filterTabText, orderFilter === 'shipped' && styles.activeFilterTabText]}>
            {t('shipped')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, orderFilter === 'transit' && styles.activeFilterTab]}
          onPress={() => handleOrderFilter('transit')}
        >
          <Text style={[styles.filterTabText, orderFilter === 'transit' && styles.activeFilterTabText]}>
            {t('transit')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterTab, orderFilter === 'delivered' && styles.activeFilterTab]}
          onPress={() => handleOrderFilter('delivered')}
        >
          <Text style={[styles.filterTabText, orderFilter === 'delivered' && styles.activeFilterTabText]}>
            {t('delivered')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Order Content */}
      <View style={styles.orderContainer}>
        {renderOrderContent()}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => onTabPress('home')}>
          <Ionicons name="home" size={20} color="#95a5a6" />
          <Text style={styles.navLabel}>{t('home')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => onTabPress('order')}>
          <MaterialIcons name="local-shipping" size={20} color="#e74c3c" />
          <Text style={[styles.navLabel, { color: '#e74c3c', fontWeight: 'bold' }]}>{t('order')}</Text>
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
    paddingTop: 20,
  },
  
  rtlContainer: {
    direction: 'rtl',
  },
  
  // Order Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  
  orderTitle: {
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
  
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
  },
  
  filterTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 2,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  
  activeFilterTab: {
    backgroundColor: '#e74c3c',
  },
  
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  
  activeFilterTabText: {
    color: '#ffffff',
  },
  
  orderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  emptyOrderState: {
    alignItems: 'center',
  },
  
  emptyOrderIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  emptyOrderIconText: {
    fontSize: 50,
    color: '#bdc3c7',
  },
  
  emptyOrderText: {
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

  // New styles for loading and error states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
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
    paddingVertical: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginTop: 10,
  },
  errorMessage: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
    paddingHorizontal: 20,
  },
  retryButton: {
    marginTop: 20,
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
  orderListContainer: {
    flex: 1,
    width: '100%',
  },
  orderItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  orderAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
});

export default OrderScreen; 