import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  TextInput,
  Alert,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AuctionDetailScreen = ({ 
  onBack, 
  auction, 
  onPlaceBid,
  onToggleFavorite,
  isFavorite = false 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [customBidAmount, setCustomBidAmount] = useState('');
  const [selectedBidAmount, setSelectedBidAmount] = useState(25000);
  const [isCustomBid, setIsCustomBid] = useState(false);
  const [showCustomBidInput, setShowCustomBidInput] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);

  // Mock data for demonstration
  const [liveBidders] = useState([
    { id: 1, name: 'Ronald Richards', bid: 24500, time: '20s', avatar: '👤' },
    { id: 2, name: 'Cameron Williamson', bid: 20000, time: '1m', avatar: '👤' },
    { id: 3, name: 'Guy Hawkins', bid: 15000, time: '5m', avatar: '👤' },
    { id: 4, name: 'Darrell Steward', bid: 12500, time: '7m', avatar: '👤' },
  ]);

  const [timeRemaining, setTimeRemaining] = useState(83); // 1:23 in seconds

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get auction images
  const getAuctionImages = () => {
    const images = [];
    if (auction?.image) images.push(auction.image);
    if (auction?.images && auction.images.length > 0) {
      images.push(...auction.images);
    }
    if (auction?.lotImage) images.push(auction.lotImage);
    if (auction?.lotImages && auction.lotImages.length > 0) {
      images.push(...auction.lotImages);
    }
    
    // If no images, return placeholder
    if (images.length === 0) {
      return ['https://via.placeholder.com/400x300/f0f0f0/cccccc?text=Auction+Image'];
    }
    
    return images;
  };

  const images = getAuctionImages();
  const currentImage = images[currentImageIndex];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}s`;
  };

  const formatPrice = (price) => {
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(1)}k`;
    }
    return `$${price.toLocaleString()}`;
  };

  const handleBid = () => {
    const bidAmount = isCustomBid ? parseFloat(customBidAmount) : selectedBidAmount;
    if (isCustomBid && (!customBidAmount || bidAmount <= 0)) {
      Alert.alert('Invalid Bid', 'Please enter a valid bid amount');
      return;
    }
    
    setShowConfirmModal(true);
  };

  const handleConfirmBid = () => {
    const bidAmount = isCustomBid ? parseFloat(customBidAmount) : selectedBidAmount;
    setShowConfirmModal(false);
    onPlaceBid && onPlaceBid(bidAmount);
    
    // Show win modal after a short delay (for demo purposes)
    setTimeout(() => {
      setShowWinModal(true);
    }, 1000);
  };

  const handleCancelBid = () => {
    setShowConfirmModal(false);
  };

  const handleCloseWinModal = () => {
    setShowWinModal(false);
  };

  const handleCustomBid = () => {
    setIsCustomBid(true);
    setShowCustomBidInput(true);
    setSelectedBidAmount(0);
  };

  const handleQuickBid = (amount) => {
    setIsCustomBid(false);
    setShowCustomBidInput(false);
    setSelectedBidAmount(amount);
    setCustomBidAmount('');
  };

  const handleConfirmCustomBid = () => {
    if (customBidAmount && parseFloat(customBidAmount) > 0) {
      setSelectedBidAmount(parseFloat(customBidAmount));
      setShowCustomBidInput(false);
    }
  };

  const handleCancelCustomBid = () => {
    setShowCustomBidInput(false);
    setCustomBidAmount('');
    setIsCustomBid(false);
    setSelectedBidAmount(25000); // Reset to default
  };

    return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        {/* Image Carousel Section */}
        <View style={styles.imageSection}>
          <Image 
            source={{ uri: currentImage }} 
            style={styles.mainImage}
            resizeMode="cover"
          />
          
          {/* Navigation Buttons */}
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.favoriteButton} onPress={onToggleFavorite}>
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={20} 
              color={isFavorite ? "#e74c3c" : "#ffffff"} 
            />
          </TouchableOpacity>
          
          {/* Expand Button */}
          <TouchableOpacity style={styles.expandButton}>
            <Ionicons name="expand" size={20} color="#ffffff" />
          </TouchableOpacity>
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {images.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.indicator, 
                  index === currentImageIndex && styles.activeIndicator
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Auction Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.auctionTitle}>
            {auction?.title || auction?.name || auction?.lotName || 'Auction Item'}
          </Text>
          <Text style={styles.auctionSubtitle}>Classic Car Auction</Text>
        </View>

        {/* Auction Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailsRow}>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Starting price</Text>
              <Text style={styles.detailValue}>
                ${(auction?.startingPrice || auction?.depositAmount || 5000).toLocaleString()}
              </Text>
              <View style={styles.participantsRow}>
                <View style={styles.avatars}>
                  <View style={styles.avatar}>👤</View>
                  <View style={styles.avatar}>👤</View>
                  <View style={styles.avatar}>👤</View>
                  <View style={styles.avatar}>👤</View>
                  <View style={styles.moreAvatars}>+24</View>
                </View>
                <Text style={styles.participantsText}>are live</Text>
              </View>
            </View>
            
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Current Bid Price</Text>
              <Text style={styles.detailValue}>
                ${(auction?.currentPrice || auction?.price || 24500).toLocaleString()}
              </Text>
              <View style={styles.timeRow}>
                <Ionicons name="time" size={16} color="#7f8c8d" />
                <Text style={styles.timeText}>{formatTime(timeRemaining)} remaining</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bid Controls */}
        <View style={styles.bidControls}>
          {/* Quick Bid Buttons */}
          <View style={styles.quickBidButtons}>
            <TouchableOpacity 
              style={[styles.quickBidButton, selectedBidAmount === 26000 && !isCustomBid && styles.selectedBidButton]} 
              onPress={() => handleQuickBid(26000)}
              disabled={isCustomBid}
            >
              <Text style={[
                styles.quickBidText, 
                selectedBidAmount === 26000 && !isCustomBid && styles.selectedBidText,
                isCustomBid && styles.disabledBidText
              ]}>
                $26k
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickBidButton, selectedBidAmount === 28000 && !isCustomBid && styles.selectedBidButton]} 
              onPress={() => handleQuickBid(28000)}
              disabled={isCustomBid}
            >
              <Text style={[
                styles.quickBidText, 
                selectedBidAmount === 28000 && !isCustomBid && styles.selectedBidText,
                isCustomBid && styles.disabledBidText
              ]}>
                $28k
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickBidButton, selectedBidAmount === 32000 && !isCustomBid && styles.selectedBidButton]} 
              onPress={() => handleQuickBid(32000)}
              disabled={isCustomBid}
            >
              <Text style={[
                styles.quickBidText, 
                selectedBidAmount === 32000 && !isCustomBid && styles.selectedBidText,
                isCustomBid && styles.disabledBidText
              ]}>
                $32k
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickBidButton, selectedBidAmount === 35000 && !isCustomBid && styles.selectedBidButton]} 
              onPress={() => handleQuickBid(35000)}
              disabled={isCustomBid}
            >
              <Text style={[
                styles.quickBidText, 
                selectedBidAmount === 35000 && !isCustomBid && styles.selectedBidText,
                isCustomBid && styles.disabledBidText
              ]}>
                $35k
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickBidButton, isCustomBid && styles.selectedBidButton]} 
              onPress={handleCustomBid}
            >
              <Text style={[styles.quickBidText, isCustomBid && styles.selectedBidText]}>
                Use Custom Bid
              </Text>
            </TouchableOpacity>
          </View>

          {/* Custom Bid Input with Confirmation Buttons */}
          {showCustomBidInput && (
            <View style={styles.customBidContainer}>
              <View style={styles.customBidRow}>
                <TextInput
                  style={styles.customBidInput}
                  placeholder="e.g 45000"
                  value={customBidAmount}
                  onChangeText={setCustomBidAmount}
                  keyboardType="numeric"
                  placeholderTextColor="#d35400"
                />
                <View style={styles.confirmationButtons}>
                  <TouchableOpacity 
                    style={styles.confirmButton} 
                    onPress={handleConfirmCustomBid}
                  >
                    <Ionicons name="checkmark" size={20} color="#ffffff" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={handleCancelCustomBid}
                  >
                    <Ionicons name="close" size={20} color="#7f8c8d" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Place Bid Button */}
          <TouchableOpacity style={styles.placeBidButton} onPress={handleBid}>
            <Text style={styles.placeBidText}>
              Place Bid for {formatPrice(selectedBidAmount)}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Confirm Bid Modal */}
      {showConfirmModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIcon}>
              <Ionicons name="card" size={40} color="#e74c3c" />
              <Ionicons name="checkmark-circle" size={20} color="#e74c3c" style={styles.checkmarkIcon} />
            </View>
            <Text style={styles.modalTitle}>Confirm Bid</Text>
            <Text style={styles.modalBodyText}>
              You have placed a bid for {formatPrice(selectedBidAmount)}.
            </Text>
            <Text style={styles.modalBodyText}>
              Should we place this as your Bid?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalPrimaryButton} onPress={handleConfirmBid}>
                <Text style={styles.modalPrimaryButtonText}>Yes, Place My Bid</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSecondaryButton} onPress={handleCancelBid}>
                <Text style={styles.modalSecondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Win The Bid Modal */}
      {showWinModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalIcon}>
              <Ionicons name="trophy" size={40} color="#e74c3c" />
            </View>
            <Text style={styles.modalTitle}>Win The Bid</Text>
            <Text style={styles.modalBodyText}>
              You have won the bid of {formatPrice(selectedBidAmount)}
            </Text>
            <TouchableOpacity style={styles.modalPrimaryButton} onPress={handleCloseWinModal}>
              <Text style={styles.modalPrimaryButtonText}>okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
 };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  // Image Section
  imageSection: {
    height: 300,
    position: 'relative',
  },
  
  mainImage: {
    width: '100%',
    height: '100%',
  },
  
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  expandButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  
  activeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffffff',
  },
  
  // Title Section
  titleSection: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  
  auctionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  
  auctionSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  
  // Details Card
  detailsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  detailColumn: {
    flex: 1,
  },
  
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  
  detailValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  avatars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  
  moreAvatars: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  
  participantsText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  timeText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  
  // Content
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  // Live Auction Section
  liveAuctionSection: {
    marginBottom: 20,
  },
  
  liveAuctionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e74c3c',
    marginRight: 8,
  },
  
  liveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  
  bidCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  
  biddersList: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
  },
  
  bidderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  
  bidderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  
  avatarText: {
    fontSize: 16,
  },
  
  bidderInfo: {
    flex: 1,
  },
  
  bidderName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  
  bidTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  
  bidAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
  },
  
  // Bid Controls
  bidControls: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  
  quickBidButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  
  quickBidButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  
  selectedBidButton: {
    backgroundColor: '#e74c3c',
  },
  
  quickBidText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2c3e50',
  },
  
  selectedBidText: {
    color: '#ffffff',
  },

  disabledBidText: {
    color: '#bdc3c7',
  },
  
  customBidContainer: {
    marginBottom: 15,
  },

  customBidRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  customBidInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#2c3e50',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    marginRight: 10,
  },

  confirmationButtons: {
    flexDirection: 'row',
  },

  confirmButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  
  placeBidButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  
  placeBidText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },

  // Modal Styles
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Very high z-index to appear above everything
  },

  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10, // Higher elevation for Android
    minWidth: 280,
    zIndex: 10000, // Even higher z-index for the container
  },

  modalIcon: {
    marginBottom: 16,
    position: 'relative',
  },

  checkmarkIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },

  modalBodyText: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 20,
  },

  modalButtons: {
    width: '100%',
    marginTop: 20,
  },

  modalPrimaryButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 8,
  },

  modalPrimaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  modalSecondaryButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e74c3c',
  },

  modalSecondaryButtonText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AuctionDetailScreen; 