import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator, Image, Modal, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const TransactionScreen = ({ onBack, t, isArabic, onTabPress, transactionData, transactionLoading, transactionError, refreshTransactionData }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'under_review', 'approved'
  const [showTopupModal, setShowTopupModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('visa');
  const [topupAmount, setTopupAmount] = useState('');

  // Fallback data for different transaction types
  const fallbackData = [
    {
      id: 1,
      title: 'Fortuner Car',
      invoiceNumber: 'Bid # Inv 001',
      date: '2, May 2024',
      time: '45 min ago',
      amount: 250,
      status: 'approved',
      image: 'https://picsum.photos/60/60?random=1'
    },
    {
      id: 2,
      title: 'Fortuner Car',
      invoiceNumber: 'Bid # Inv 002',
      date: '1, May 2024',
      time: '2 hours ago',
      amount: 300,
      status: 'pending',
      image: 'https://picsum.photos/60/60?random=2'
    },
    {
      id: 3,
      title: 'Fortuner Car',
      invoiceNumber: 'Bid # Inv 003',
      date: '30, Apr 2024',
      time: '1 day ago',
      amount: 200,
      status: 'under_review',
      image: 'https://picsum.photos/60/60?random=3'
    }
  ];

  const currentBalance = 450.54;

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#27ae60'; // light green
      case 'pending':
        return '#3498db'; // light blue
      case 'under_review':
        return '#e91e63'; // light pink/purple
      default:
        return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'approved';
      case 'pending': return 'pending';
      case 'under_review': return 'under review';
      default: return status;
    }
  };

  const renderTransactionItem = (item) => (
    <View key={item.id} style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.transactionImage}
        />
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionInvoice}>{item.invoiceNumber}</Text>
        </View>
      </View>
      
      <View style={styles.transactionRight}>
        <Text style={styles.transactionDate}>{item.date}</Text>
        <Text style={styles.transactionTime}>{item.time}</Text>
      </View>
      
      <View style={styles.transactionBottom}>
        <View style={styles.depositRow}>
          <Text style={styles.depositLabel}>Deposit amount</Text>
          <Text style={styles.depositAmount}>{item.amount}$</Text>
        </View>
        
        <View style={styles.refundRow}>
          <Text style={styles.refundLabel}>Refund Status</Text>
          <View style={styles.refundStatus}>
            <TouchableOpacity style={styles.refundButton}>
              <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.refundButton}>
              <Ionicons name="close-circle" size={20} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[styles.statusPill, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
    </View>
  );

  const renderTopupModal = () => (
    <Modal
      visible={showTopupModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowTopupModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Topup</Text>
            <TouchableOpacity onPress={() => setShowTopupModal(false)}>
              <Ionicons name="close" size={24} color="#2c3e50" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.amountInput}>
            <Text style={styles.inputLabel}>Enter amount</Text>
            <TextInput
              style={styles.textInput}
              value={topupAmount}
              onChangeText={setTopupAmount}
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>
          
          <TouchableOpacity style={styles.addPaymentMethod}>
            <Text style={styles.addPaymentText}>Add payment Method</Text>
          </TouchableOpacity>
          
          <View style={styles.paymentMethods}>
            <Text style={styles.paymentMethodsTitle}>Select Payment Method</Text>
            
            <TouchableOpacity 
              style={[styles.paymentCard, selectedPaymentMethod === 'visa' && styles.selectedCard]}
              onPress={() => setSelectedPaymentMethod('visa')}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardType}>VISA</Text>
                <Text style={styles.cardNumber}>**** **** **** 8970</Text>
                <Text style={styles.cardExpiry}>Expires: 12/26</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.paymentCard, selectedPaymentMethod === 'mastercard' && styles.selectedCard]}
              onPress={() => setSelectedPaymentMethod('mastercard')}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardType}>Mastercard</Text>
                <Text style={styles.cardNumber}>**** **** **** 8970</Text>
                <Text style={styles.cardExpiry}>Expires: 12/26</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.paymentCard, selectedPaymentMethod === 'paypal' && styles.selectedCard]}
              onPress={() => setSelectedPaymentMethod('paypal')}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardType}>PayPal</Text>
                <Text style={styles.cardNumber}>mailaddress@mail.com</Text>
                <Text style={styles.cardExpiry}>Expires: 12/26</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.paymentCard, selectedPaymentMethod === 'cash' && styles.selectedCard]}
              onPress={() => setSelectedPaymentMethod('cash')}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardType}>Cash</Text>
                <Text style={styles.cardNumber}>$</Text>
                <Text style={styles.cardExpiry}>Expires: 12/26</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.doneButton}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment & Deposits</Text>
        <TouchableOpacity style={styles.topupButton} onPress={() => setShowTopupModal(true)}>
          <Ionicons name="wallet" size={20} color="white" />
          <Text style={styles.topupButtonText}>Topup</Text>
        </TouchableOpacity>
      </View>

      {/* Balance Section */}
      <View style={styles.balanceSection}>
        <Text style={styles.balanceAmount}>${currentBalance}</Text>
        <Text style={styles.balanceLabel}>Current Deposit Balance</Text>
      </View>

      {/* Action Icons */}
      <View style={styles.actionIcons}>
        <TouchableOpacity style={styles.actionIcon}>
          <View style={styles.iconCircle}>
            <Ionicons name="cash" size={24} color="#e74c3c" />
          </View>
          <Text style={styles.iconLabel}>Deposit Tracking</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionIcon}>
          <View style={styles.iconCircle}>
            <Ionicons name="time" size={24} color="#e74c3c" />
          </View>
          <Text style={styles.iconLabel}>Payment History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionIcon}>
          <View style={styles.iconCircle}>
            <Ionicons name="arrow-down-circle" size={24} color="#e74c3c" />
          </View>
          <Text style={styles.iconLabel}>Refund Requests</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]} 
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'under_review' && styles.activeTab]} 
          onPress={() => setActiveTab('under_review')}
        >
          <Text style={[styles.tabText, activeTab === 'under_review' && styles.activeTabText]}>Under Review</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'approved' && styles.activeTab]} 
          onPress={() => setActiveTab('approved')}
        >
          <Text style={[styles.tabText, activeTab === 'approved' && styles.activeTabText]}>Approved</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction List */}
      <ScrollView style={styles.transactionList}>
        {fallbackData.map(renderTransactionItem)}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => onTabPress('home')}>
          <Ionicons name="home" size={20} color="#95a5a6" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => onTabPress('order')}>
          <MaterialIcons name="local-shipping" size={20} color="#95a5a6" />
          <Text style={styles.navLabel}>Order</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => onTabPress('transaction')}>
          <FontAwesome5 name="money-bill-wave" size={20} color="#e74c3c" />
          <Text style={[styles.navLabel, { color: '#e74c3c', fontWeight: 'bold' }]}>Payment</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => onTabPress('chat')}>
          <Ionicons name="chatbubble" size={20} color="#95a5a6" />
          <Text style={styles.navLabel}>Chat</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => onTabPress('profile')}>
          <Ionicons name="person" size={20} color="#95a5a6" />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>

      {renderTopupModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  topupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  topupButtonText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
  },
  balanceSection: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  actionIcons: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    marginBottom: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  actionIcon: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e74c3c',
  },
  iconLabel: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
  tabContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#e74c3c',
  },
  tabText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  activeTabText: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  transactionList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transactionItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  transactionLeft: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  transactionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  transactionInvoice: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  transactionRight: {
    position: 'absolute',
    top: 15,
    right: 15,
    alignItems: 'flex-end',
  },
  transactionDate: {
    fontSize: 14,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  transactionTime: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  transactionBottom: {
    marginTop: 10,
  },
  depositRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  depositLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  depositAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  refundRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  refundLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  refundStatus: {
    flexDirection: 'row',
    gap: 8,
  },
  refundButton: {
    padding: 4,
  },
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
  invoiceButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  invoiceButtonText: {
    fontSize: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  refundInfo: {
    alignItems: 'center',
  },
  refundDate: {
    fontSize: 10,
    color: '#27ae60',
    marginBottom: 4,
  },
  bottomNav: {
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navLabel: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  amountInput: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#2c3e50',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addPaymentMethod: {
    marginBottom: 20,
  },
  addPaymentText: {
    color: '#e74c3c',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  paymentMethods: {
    marginBottom: 20,
  },
  paymentMethodsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  paymentCard: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  selectedCard: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  cardNumber: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  cardExpiry: {
    fontSize: 12,
    color: '#95a5a6',
  },
  doneButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionScreen; 