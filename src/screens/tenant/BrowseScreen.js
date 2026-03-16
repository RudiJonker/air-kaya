import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image,
  TouchableOpacity, TextInput, ActivityIndicator,
  Alert, RefreshControl, Share, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, fonts } from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../utils/authService';
import { storageService } from '../../utils/storageService';
import { listingService } from '../../utils/listingService';
import { ACCOMMODATION_TYPES } from '../../constants/listing';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import CityAutocomplete from '../../components/common/CityAutocomplete';




export default function BrowseScreen({ navigation }) {
  const { user, profile } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCity, setSearchCity] = useState(profile?.city || '');
  const [refreshing, setRefreshing] = useState(false);
  const [showLocationInfo, setShowLocationInfo] = useState(false);
  

  useFocusEffect(
  useCallback(() => {
    loadListings(searchCity);
  }, [searchCity])
);

const handleShareApp = async () => {
  await Share.share({
    message: `🏡 Looking for affordable accommodation in South Africa?\n\nDownload Air Kaya and find your next home or list your property today — it's free!\n\n👉 https://drive.google.com/file/d/12RyehS3mWG7q6XTpBNTpr361CGNtalR6/view?usp=drive_link`,
  });
};

  const handleRefresh = async () => {
  setRefreshing(true);
  await loadListings(searchCity);
  setRefreshing(false);
};

  const loadListings = async (city = searchCity) => {
    setLoading(true);
    try {
      const { data, error } = await listingService.getActiveListings(city);
      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Browse error:', error);
      Alert.alert('Error', 'Could not load listings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadListings(searchCity);
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await storageService.clearUserProfile();
          await authService.signOut();
        }
      }
    ]);
  };

  const getTypeLabel = (value) => {
    const found = ACCOMMODATION_TYPES.find(t => t.value === value);
    return found ? found.label : value;
  };

  const getCoverPhoto = (listing) => {
    if (listing.listing_images && listing.listing_images.length > 0) {
      const cover = listing.listing_images.find(img => img.order_index === 0)
        || listing.listing_images[0];
      return cover.url;
    }
    return null;
  };

  const renderListing = ({ item }) => {
    const coverPhoto = getCoverPhoto(item);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ListingDetail', { listing: item })}
        activeOpacity={0.85}
      >
        {coverPhoto
          ? <Image source={{ uri: coverPhoto }} style={styles.cardPhoto} />
          : <View style={styles.cardPhotoPlaceholder}>
              <Text style={styles.cardPhotoPlaceholderText}>🏠</Text>
            </View>
        }
        <View style={styles.cardBody}>
          <Text style={styles.cardType}>{getTypeLabel(item.type)}</Text>
          <Text style={styles.cardCity}>📍 {[item.suburb, item.city, item.province].filter(Boolean).join(', ')}</Text>
          <Text style={styles.cardPrice}>
            R{item.price_amount}
            <Text style={styles.cardPricePeriod}>
              {' '}/{item.price_period === 'monthly' ? 'month' : 'week'}
            </Text>
          </Text>
          {item.description ? (
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}
          <View style={styles.cardFooter}>
            <Text style={styles.cardMaxOccupants}>
              👤 Up to {item.max_occupants} {item.max_occupants === 1 ? 'person' : 'people'}
            </Text>
            {item.deposit && (
              <Text style={styles.cardDeposit}>Deposit required</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
<View style={styles.header}>
  <View style={styles.headerLeft}>
    <Text style={styles.headerGreeting}>
      Hi, {profile?.full_name?.split(' ')[0] || 'there'} 👋
    </Text>
    <Text style={styles.headerSub}>Find a place to rent</Text>
  </View>
  <TouchableOpacity
    onPress={() => navigation.navigate('Profile')}
    style={styles.profileBtn}
  >
    {profile?.avatar_url
      ? <Image source={{ uri: profile.avatar_url }} style={styles.profileAvatar} />
      : <Text style={styles.profileBtnText}>👤</Text>
    }
  </TouchableOpacity>
  <TouchableOpacity onPress={handleShareApp} style={styles.shareBtn}>
    <Text style={styles.shareBtnText}>📤</Text>
  </TouchableOpacity>
  <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
    <Text style={styles.signOutText}>Sign Out</Text>
  </TouchableOpacity>
</View>

      {/* Search Bar */}
<View style={styles.searchRow}>
  <View style={styles.searchInputWrapper}>
    <CityAutocomplete
      value={searchCity}
      placeholder="Suburb, city or province"
      onSelectCity={(city) => {
        setSearchCity(city);
        loadListings(city);
      }}
    />
  </View>
  <TouchableOpacity style={styles.infoBtn} onPress={() => setShowLocationInfo(true)}>
    <Text style={styles.infoBtnText}>ℹ️</Text>
  </TouchableOpacity>
  <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
    <Text style={styles.searchBtnText}>Search</Text>
  </TouchableOpacity>
</View>

{/* Location Info Modal */}
<Modal
  visible={showLocationInfo}
  transparent
  animationType="fade"
  onRequestClose={() => setShowLocationInfo(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalCard}>
      <Text style={styles.modalTitle}>📍 Location Names</Text>
      <Text style={styles.modalBody}>
        Some location databases use new Municipal names instead of well-known area names.{'\n\n'}
        For example, "East London" may appear as "KuGompo", or "Buffalo City".{'\n\n'}
        If you can't find listings in your area, try searching using the alternative city name, or searching by suburb or province instead.{'\n\n'}
        
      </Text>
      <TouchableOpacity
        style={styles.modalCloseBtn}
        onPress={() => setShowLocationInfo(false)}
      >
        <Text style={styles.modalCloseBtnText}>Got it</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

      {/* Results Count */}
      {!loading && (
        <Text style={styles.resultsCount}>
          {listings.length === 0
            ? 'No listings found'
            : `${listings.length} listing${listings.length === 1 ? '' : 's'} found`
          }
          {searchCity ? ` in ${searchCity}` : ''}
        </Text>
      )}

      {/* Listings */}
      {loading
        ? <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: spacing.xl }}
          />
        : listings.length === 0
          ? <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyTitle}>No listings found</Text>
              <Text style={styles.emptySubtitle}>
                Try searching a different city or clear the search to see all listings.
              </Text>
              <TouchableOpacity
                style={styles.clearBtn}
                onPress={() => { setSearchCity(''); loadListings(''); }}
              >
                <Text style={styles.clearBtnText}>Show All Listings</Text>
              </TouchableOpacity>
            </View>
          : <FlatList
  data={listings}
  keyExtractor={(item) => item.id}
  renderItem={renderListing}
  contentContainerStyle={styles.listContent}
  showsVerticalScrollIndicator={false}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      colors={[colors.primary]}
      tintColor={colors.primary}
    />
  }
/>
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightGrey },
  header: {
    backgroundColor: colors.primary,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerGreeting: {
    color: colors.white,
    fontSize: fonts.large,
    fontWeight: 'bold',
  },
  headerSub: {
    color: colors.primaryLight,
    fontSize: fonts.small,
    marginTop: 2,
  },
  signOutBtn: {
    paddingLeft: spacing.xs,
  },
  signOutText: {
    color: colors.white,
    fontSize: fonts.small,
    opacity: 0.8,
  },
  profileBtn: {
    backgroundColor: colors.primaryDark,
    borderRadius: 999,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBtnText: {
    fontSize: 18,
  },
  searchRow: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    zIndex: 10,
  },
  searchInputWrapper: {
    flex: 1,
    zIndex: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fonts.body,
    color: colors.dark,
    backgroundColor: colors.lightGrey,
  },
  suggestionsBox: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    zIndex: 20,
    elevation: 5,
  },
  suggestionRow: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  suggestionText: {
    fontSize: fonts.body,
    color: colors.dark,
  },
  searchBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: fonts.body,
  },
  resultsCount: {
    fontSize: fonts.small,
    color: colors.grey,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  listContent: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardPhoto: {
    width: '100%',
    height: 180,
  },
  cardPhotoPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPhotoPlaceholderText: { fontSize: 48 },
  cardBody: {
    padding: spacing.md,
  },
  cardType: {
    fontSize: fonts.large,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  cardCity: {
    fontSize: fonts.body,
    color: colors.grey,
    marginBottom: spacing.xs,
  },
  cardPrice: {
    fontSize: fonts.xlarge,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  cardPricePeriod: {
    fontSize: fonts.body,
    fontWeight: 'normal',
    color: colors.grey,
  },
  cardDescription: {
    fontSize: fonts.body,
    color: colors.grey,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  cardMaxOccupants: {
    fontSize: fonts.small,
    color: colors.grey,
  },
  cardDeposit: {
    fontSize: fonts.small,
    color: colors.warning,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyEmoji: { fontSize: 56, marginBottom: spacing.md },
  emptyTitle: {
    fontSize: fonts.large,
    fontWeight: 'bold',
    color: colors.dark,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fonts.body,
    color: colors.grey,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  clearBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: 8,
  },
  clearBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: fonts.body,
  },
  profileAvatar: {
  width: 36,
  height: 36,
  borderRadius: 999,
},
shareBtn: {
  padding: spacing.xs,
  marginRight: spacing.xs,
},
shareBtnText: {
  fontSize: 22,
},
infoBtn: {
  padding: spacing.sm,
  marginRight: spacing.xs,
},
infoBtnText: {
  fontSize: 20,
},
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  alignItems: 'center',
  justifyContent: 'center',
  padding: spacing.lg,
},
modalCard: {
  backgroundColor: colors.white,
  borderRadius: 12,
  padding: spacing.lg,
  width: '100%',
},
modalTitle: {
  fontSize: fonts.large,
  fontWeight: '700',
  color: colors.dark,
  marginBottom: spacing.md,
},
modalBody: {
  fontSize: fonts.body,
  color: colors.dark,
  lineHeight: 24,
  marginBottom: spacing.lg,
},
modalCloseBtn: {
  backgroundColor: colors.primary,
  padding: spacing.md,
  borderRadius: 8,
  alignItems: 'center',
},
modalCloseBtnText: {
  color: colors.white,
  fontSize: fonts.medium,
  fontWeight: 'bold',
},
});