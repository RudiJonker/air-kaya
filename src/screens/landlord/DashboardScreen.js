import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Image, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, fonts } from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../utils/authService';
import { storageService } from '../../utils/storageService';
import { listingService } from '../../utils/listingService';
import { ACCOMMODATION_TYPES } from '../../constants/listing';

export default function DashboardScreen({ navigation }) {
  const { user, profile } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reload listings every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadListings();
    }, [])
  );

  const loadListings = async () => {
    setLoading(true);
    try {
      const { data, error } = await listingService.getLandlordListings(user.id);
      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Load listings error:', error);
      Alert.alert('Error', 'Could not load your listings.');
    } finally {
      setLoading(false);
    }
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

  const handleToggleStatus = async (listing) => {
    const newStatus = listing.status === 'active' ? 'paused' : 'active';
    try {
      const { error } = await listingService.updateListing(listing.id, { status: newStatus });
      if (error) throw error;
      setListings(prev =>
        prev.map(l => l.id === listing.id ? { ...l, status: newStatus } : l)
      );
    } catch (error) {
      Alert.alert('Error', 'Could not update listing status.');
    }
  };

  const handleDelete = async (listing) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await listingService.deleteListing(listing.id);
              if (error) throw error;
              setListings(prev => prev.filter(l => l.id !== listing.id));
            } catch (error) {
              Alert.alert('Error', 'Could not delete listing.');
            }
          }
        }
      ]
    );
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
    const isActive = item.status === 'active';

    return (
      <View style={styles.listingCard}>
        <View style={styles.cardTop}>
          {coverPhoto
            ? <Image source={{ uri: coverPhoto }} style={styles.cardPhoto} />
            : <View style={styles.cardPhotoPlaceholder}>
                <Text style={styles.cardPhotoPlaceholderText}>📷</Text>
              </View>
          }
          <View style={styles.cardInfo}>
            <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusPaused]}>
              <Text style={styles.statusText}>{isActive ? '● Active' : '● Paused'}</Text>
            </View>
            <Text style={styles.cardType}>{getTypeLabel(item.type)}</Text>
            <Text style={styles.cardCity}>{item.city}, {item.province}</Text>
            <Text style={styles.cardPrice}>
              R{item.price_amount} / {item.price_period === 'monthly' ? 'month' : 'week'}
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnToggle]}
            onPress={() => handleToggleStatus(item)}
          >
            <Text style={styles.actionBtnText}>
              {isActive ? 'Pause' : 'Activate'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnEdit]}
            onPress={() => navigation.navigate('EditListing', { listing: item })}
          >
            <Text style={styles.actionBtnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnDelete]}
            onPress={() => handleDelete(item)}
          >
            <Text style={[styles.actionBtnText, { color: colors.white }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const activeCount = listings.filter(l => l.status === 'active').length;
  const pausedCount = listings.filter(l => l.status === 'paused').length;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
  <View>
    <Text style={styles.headerGreeting}>
      Hi, {profile?.full_name?.split(' ')[0] || 'Landlord'} 👋
    </Text>
    <Text style={styles.headerSub}>Manage your listings</Text>
  </View>
  <View style={styles.headerActions}>
    <TouchableOpacity
      onPress={() => navigation.navigate('Profile')}
      style={styles.profileBtn}
    >
      <Text style={styles.profileBtnText}>👤</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={handleSignOut}>
      <Text style={styles.signOutText}>Sign Out</Text>
    </TouchableOpacity>
  </View>
</View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{listings.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.success }]}>{activeCount}</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>{pausedCount}</Text>
          <Text style={styles.statLabel}>Paused</Text>
        </View>
      </View>

      {/* Add Button */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate('CreateListing')}
      >
        <Text style={styles.addBtnText}>+ Add New Listing</Text>
      </TouchableOpacity>

      {/* Listings */}
      {loading
        ? <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
        : listings.length === 0
          ? <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🏠</Text>
              <Text style={styles.emptyTitle}>No listings yet</Text>
              <Text style={styles.emptySubtitle}>Tap the button above to add your first listing.</Text>
            </View>
          : <FlatList
              data={listings}
              keyExtractor={(item) => item.id}
              renderItem={renderListing}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.lightGrey },
  header: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerGreeting: {
    fontSize: fonts.large,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSub: {
    fontSize: fonts.small,
    color: colors.primaryMid,
    marginTop: 2,
  },
  signOutText: {
    fontSize: fonts.body,
    color: colors.primaryMid,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: fonts.xlarge,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: fonts.small,
    color: colors.grey,
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: colors.primary,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  addBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: fonts.medium,
  },
  listContent: {
    padding: spacing.md,
    paddingTop: 0,
  },
  listingCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.md,
  },
  cardPhoto: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  cardPhotoPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPhotoPlaceholderText: {
    fontSize: 32,
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: 999,
    marginBottom: spacing.xs,
  },
  statusActive: { backgroundColor: '#E8F5E9' },
  statusPaused: { backgroundColor: '#FFF3E0' },
  statusText: {
    fontSize: fonts.small,
    fontWeight: '600',
    color: colors.dark,
  },
  cardType: {
    fontSize: fonts.medium,
    fontWeight: '700',
    color: colors.dark,
  },
  cardCity: {
    fontSize: fonts.small,
    color: colors.grey,
    marginTop: 2,
  },
  cardPrice: {
    fontSize: fonts.body,
    fontWeight: '600',
    color: colors.primary,
    marginTop: spacing.xs,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  actionBtnToggle: { backgroundColor: colors.lightGrey },
  actionBtnEdit: { backgroundColor: colors.lightGrey },
  actionBtnDelete: { backgroundColor: colors.error },
  actionBtnText: {
    fontSize: fonts.small,
    fontWeight: '600',
    color: colors.dark,
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
  },
  headerActions: {
  alignItems: 'flex-end',
  gap: spacing.xs,
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
});