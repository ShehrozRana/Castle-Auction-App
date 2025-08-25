import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  FlatList,
  Dimensions
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CategoryAuctionsScreen = ({ 
  onBack, 
  categoryName = "Arts & Abstracts",
  onAuctionPress 
}) => {
  const [selectedCategory, setSelectedCategory] = useState(categoryName);
  const [auctionData, setAuctionData] = useState([]);

  // Categories for the filter tabs
  const categories = categoryName === 'All Categories' ? [
    "All Categories",
    "Arts & Abstracts",
    "Vehicles", 
    "Antiques",
    "Electronics"
  ] : categoryName === 'Trending' ? [
    "Trending",
    "Arts & Abstracts",
    "Vehicles", 
    "Antiques",
    "Electronics"
  ] : [
    "Arts & Abstracts",
    "Vehicles", 
    "Antiques",
    "Electronics"
  ];

  // Mock auction data for the category
  const mockAuctions = [
    {
      id: 1,
      title: "Cumulonimbus",
      price: 150000,
      image: "https://picsum.photos/300/200?random=1",
      isNewOffer: true
    },
    {
      id: 2,
      title: "Pyramid of Nature",
      price: 450000,
      image: "https://picsum.photos/300/200?random=2",
      isNewOffer: true
    },
    {
      id: 3,
      title: "Heart Shadowing",
      price: 250000,
      image: "https://picsum.photos/300/200?random=3",
      isNewOffer: true
    },
    {
      id: 4,
      title: "Lonely Swan",
      price: 350000,
      image: "https://picsum.photos/300/200?random=4",
      isNewOffer: true
    },
    {
      id: 5,
      title: "Abstract Harmony",
      price: 180000,
      image: "https://picsum.photos/300/200?random=5",
      isNewOffer: true
    },
    {
      id: 6,
      title: "Mountain Dreams",
      price: 320000,
      image: "https://picsum.photos/300/200?random=6",
      isNewOffer: true
    }
  ];

  useEffect(() => {
    // In a real app, you would fetch auctions by category from API
    if (selectedCategory === 'All Categories' || selectedCategory === 'Trending') {
      // For "All Categories" or "Trending", show all auctions
      setAuctionData(mockAuctions);
    } else {
      // For specific categories, filter auctions (in real app, fetch from API)
      setAuctionData(mockAuctions);
    }
  }, [selectedCategory]);

  const formatPrice = (price) => {
    return `Rp.${price.toLocaleString()}`;
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    // Here you would fetch auctions for the selected category
  };

  const handleAuctionPress = (auction) => {
    onAuctionPress && onAuctionPress(auction);
  };

  const handleImageError = (item) => {
    console.log('Image failed to load for auction:', item.title);
  };

  const renderAuctionCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.auctionCard}
      onPress={() => handleAuctionPress(item)}
    >
             <View style={styles.imageContainer}>
         <Image 
           source={{ uri: item.image }} 
           style={styles.auctionImage}
           resizeMode="cover"
           onError={() => handleImageError(item)}
         />
         <TouchableOpacity style={styles.favoriteButton}>
           <Ionicons name="heart-outline" size={16} color="#ffffff" />
         </TouchableOpacity>
       </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.auctionTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        {item.isNewOffer && (
          <Text style={styles.newOfferLabel}>New Offer</Text>
        )}
        
        <Text style={styles.auctionPrice}>
          {formatPrice(item.price)}
        </Text>
        
        <TouchableOpacity style={styles.joinAuctionButton}>
          <Text style={styles.joinAuctionText}>Join Auction</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedCategory}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Category Filter Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              selectedCategory === category && styles.selectedCategoryTab
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={[
              styles.categoryTabText,
              selectedCategory === category && styles.selectedCategoryTabText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Auction Grid */}
             <FlatList
         data={auctionData}
         renderItem={renderAuctionCard}
         keyExtractor={(item) => item.id.toString()}
         numColumns={2}
         columnWrapperStyle={styles.row}
         contentContainerStyle={styles.gridContainer}
         showsVerticalScrollIndicator={false}
       />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  
  headerSpacer: {
    width: 40,
  },
  
  // Category Tabs
  categoryScroll: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  
  categoryScrollContent: {
    paddingHorizontal: 20,
  },
  
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  
  selectedCategoryTab: {
    backgroundColor: '#e74c3c',
  },
  
  categoryTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  
  selectedCategoryTabText: {
    color: '#ffffff',
  },
  
  // Grid Layout
  gridContainer: {
    padding: 15,
  },
  
  row: {
    justifyContent: 'space-between',
  },
  
  // Auction Card
  auctionCard: {
    width: (width - 45) / 2, // Account for padding and gap
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 15,
  },
  
  imageContainer: {
    position: 'relative',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0', // Fallback background color
  },
  
  auctionImage: {
    width: '100%',
    height: '100%',
  },
  
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  cardContent: {
    padding: 12,
  },
  
  auctionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
    lineHeight: 18,
  },
  
  newOfferLabel: {
    fontSize: 11,
    color: '#7f8c8d',
    marginBottom: 6,
  },
  
  auctionPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  
  joinAuctionButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  
  joinAuctionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default CategoryAuctionsScreen; 