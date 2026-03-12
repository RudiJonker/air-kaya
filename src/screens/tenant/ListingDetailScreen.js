import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, Linking, Alert, Dimensions, Share
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fonts } from '../../styles/theme';
import { ACCOMMODATION_TYPES, UTILITIES, AMENITIES, LEASE_PERIODS } from '../../constants/listing';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { AD_UNIT_ID } from '../../config/admob';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ListingDetailScreen({ navigation, route }) {
  const { listing } = route.params;
  const [activePhoto, setActivePhoto] = useState(0);

  const photos = listing.listing_images
    ? listing.listing_images
        .sort((a, b) => a.order_index - b.order_index)
        .map(img => img.url)
    : [];

const handleShare = async () => {
  try {
    await Share.share({
      message:
        `🏡 Check out this ${getTypeLabel(listing.type)} on Air Kaya!\n\n` +
        `📍 ${listing.city}, ${listing.province}\n` +
        `💰 R${listing.price_amount}/${listing.price_period === 'monthly' ? 'month' : 'week'}\n\n` +
        `Download Air Kaya to find affordable accommodation across South Africa.`,
    });
  } catch (error) {
    console.error('Share error:', error);
  }
};

  const getTypeLabel = (value) => {
    const found = ACCOMMODATION_TYPES.find(t => t.value === value);
    return found ? found.label : value;
  };

  const getLeasePeriodLabel = (value) => {
    const found = LEASE_PERIODS.find(l => l.value === value);
    return found ? found.label : value;
  };

  const getUtilityLabel = (value) => {
    const found = UTILITIES.find(u => u.value === value);
    return found ? `${found.icon} ${found.label}` : value;
  };

  const getAmenityLabel = (value) => {
    const found = AMENITIES.find(a => a.value === value);
    return found ? `${found.icon} ${found.label}` : value;
  };

  const handleWhatsApp = () => {
    const phone = listing.phone?.replace(/\s/g, '').replace(/^0/, '27');
    const message = encodeURIComponent(
      `Hi! I found your listing on Air Kaya and I'm interested in the ${getTypeLabel(listing.type)} in ${listing.city}. Is it still available?`
    );
    const url = `https://wa.me/${phone}?text=${message}`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Could not open WhatsApp. Please check it is installed.')
    );
  };

  const handleCall = () => {
    const phone = listing.phone?.replace(/\s/g, '');
    Linking.openURL(`tel:${phone}`).catch(() =>
      Alert.alert('Error', 'Could not make a call.')
    );
  };

  const handleContact = () => {
    const pref = listing.contact_pref;
    if (pref === 'whatsapp') {
      handleWhatsApp();
    } else if (pref === 'call') {
      handleCall();
    } else {
      // both — show options
      Alert.alert(
        'Contact Landlord',
        'How would you like to get in touch?',
        [
          { text: 'WhatsApp', onPress: handleWhatsApp },
          { text: 'Call', onPress: handleCall },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
    <Text style={styles.backText}>← Back</Text>
  </TouchableOpacity>
  <Text style={styles.headerTitle}>{getTypeLabel(listing.type)}</Text>
  <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
    <Text style={styles.shareBtnText}>Share</Text>
  </TouchableOpacity>
</View>

{/* Ad Banner */}
<View style={styles.adContainer}>
  <BannerAd
    unitId={AD_UNIT_ID}
    size={BannerAdSize.BANNER}
    requestOptions={{
      requestNonPersonalizedAdsOnly: true,
    }}
  />
</View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Photo Gallery */}
        {photos.length > 0
          ? <>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                  setActivePhoto(index);
                }}
              >
                {photos.map((url, index) => (
                  <Image
                    key={index}
                    source={{ uri: url }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>
              {photos.length > 1 && (
                <View style={styles.dotRow}>
                  {photos.map((_, index) => (
                    <View
                      key={index}
                      style={[styles.dot, index === activePhoto && styles.dotActive]}
                    />
                  ))}
                </View>
              )}
            </>
          : <View style={styles.photoPlaceholder}>
              <Text style={styles.photoPlaceholderText}>🏠</Text>
            </View>
        }

        <View style={styles.body}>

          {/* Price & Type */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>
              R{listing.price_amount}
              <Text style={styles.pricePeriod}>
                {' '}/{listing.price_period === 'monthly' ? 'month' : 'week'}
              </Text>
            </Text>
            <View style={styles.typeBadge}>
              <Text style={styles.typeBadgeText}>{getTypeLabel(listing.type)}</Text>
            </View>
          </View>

          {/* Location */}
          <TouchableOpacity
            style={styles.locationRow}
            onPress={() => Linking.openURL(
              `https://maps.google.com/?q=${encodeURIComponent(`${listing.city}, ${listing.province}`)}`
            )}
          >
            <Text style={styles.locationText}>
              📍 {listing.city}, {listing.province}
            </Text>
            <Text style={styles.locationLink}>View map →</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Key Details */}
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>👤</Text>
              <Text style={styles.detailLabel}>Max Occupants</Text>
              <Text style={styles.detailValue}>
                {listing.max_occupants} {listing.max_occupants === 1 ? 'person' : 'people'}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>📋</Text>
              <Text style={styles.detailLabel}>Lease Period</Text>
              <Text style={styles.detailValue}>{getLeasePeriodLabel(listing.lease_period)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>💰</Text>
              <Text style={styles.detailLabel}>Deposit</Text>
              <Text style={styles.detailValue}>
                {listing.deposit
                  ? listing.deposit_amount
                    ? `R${listing.deposit_amount}`
                    : 'Required'
                  : 'None'
                }
              </Text>
            </View>
          </View>

          {/* Description */}
          {listing.description ? (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>About this space</Text>
              <Text style={styles.description}>{listing.description}</Text>
            </>
          ) : null}

          {/* Utilities */}
          {listing.utilities && listing.utilities.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Utilities Included</Text>
              <View style={styles.tagRow}>
                {listing.utilities.map((u, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{getUtilityLabel(u)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Amenities */}
          {listing.amenities && listing.amenities.length > 0 && (
            <>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Extras & Amenities</Text>
              <View style={styles.tagRow}>
                {listing.amenities.map((a, i) => (
                  <View key={i} style={styles.tag}>
                    <Text style={styles.tagText}>{getAmenityLabel(a)}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <View style={{ height: 100 }} />

        </View>
      </ScrollView>

      {/* Contact Button — fixed at bottom */}
      <View style={styles.contactBar}>
        {listing.contact_pref === 'both'
          ? <View style={styles.contactBothRow}>
              <TouchableOpacity
                style={[styles.contactBtn, styles.contactBtnWhatsApp]}
                onPress={handleWhatsApp}
              >
                <Text style={[styles.contactBtnText, { color: '#FFFFFF' }]}>💬 WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.contactBtn, styles.contactBtnCall]}
                onPress={handleCall}
              >
                <Text style={[styles.contactBtnText, { color: '#FFFFFF' }]}>📞 Call</Text>
              </TouchableOpacity>
            </View>
          : <TouchableOpacity
              style={[styles.contactBtn, styles.contactBtnFull]}
              onPress={handleContact}
            >
              <Text style={[styles.contactBtnText, { color: '#FFFFFF' }]}>
                {listing.contact_pref === 'whatsapp' ? '💬 WhatsApp Landlord' : '📞 Call Landlord'}
              </Text>
            </TouchableOpacity>
        }
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  backBtn: { width: 60 },
  backText: { color: colors.white, fontSize: fonts.body },
  headerTitle: {
    fontSize: fonts.large,
    fontWeight: 'bold',
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  photo: {
    width: SCREEN_WIDTH,
    height: 260,
  },
  photoPlaceholder: {
    width: SCREEN_WIDTH,
    height: 260,
    backgroundColor: colors.lightGrey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoPlaceholderText: { fontSize: 64 },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
    backgroundColor: colors.white,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 16,
  },
  body: {
    padding: spacing.lg,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  price: {
    fontSize: fonts.xxlarge,
    fontWeight: 'bold',
    color: colors.primary,
  },
  pricePeriod: {
    fontSize: fonts.body,
    fontWeight: 'normal',
    color: colors.grey,
  },
  typeBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  typeBadgeText: {
    fontSize: fonts.small,
    fontWeight: '700',
    color: colors.primary,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  locationText: {
    fontSize: fonts.body,
    color: colors.grey,
  },
  locationLink: {
    fontSize: fonts.small,
    color: colors.primary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.large,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.md,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  detailItem: {
    flex: 1,
    backgroundColor: colors.lightGrey,
    borderRadius: 8,
    padding: spacing.md,
    alignItems: 'center',
  },
  detailIcon: { fontSize: 24, marginBottom: spacing.xs },
  detailLabel: {
    fontSize: fonts.small,
    color: colors.grey,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: fonts.small,
    fontWeight: '700',
    color: colors.dark,
    textAlign: 'center',
  },
  description: {
    fontSize: fonts.body,
    color: colors.grey,
    lineHeight: 22,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  tagText: {
    fontSize: fonts.small,
    color: colors.primary,
    fontWeight: '600',
  },
  contactBar: {
  backgroundColor: colors.white,
  padding: spacing.md,
  paddingBottom: spacing.xxl,
  borderTopWidth: 1,
  borderTopColor: colors.border,
},
  contactBothRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  contactBtn: {
    flex: 1,
    padding: spacing.sm,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  contactBtnFull: {
    backgroundColor: colors.primary,
  },
  contactBtnWhatsApp: {
    backgroundColor: '#25D366',
  },
  contactBtnCall: {
    backgroundColor: colors.primary,
  },
  contactBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: fonts.medium,
  },
  shareBtn: {
  width: 60,
  alignItems: 'flex-end',
},
shareBtnText: {
  color: colors.white,
  fontSize: fonts.body,
  fontWeight: '600',
},
adContainer: {
  alignItems: 'center',
  backgroundColor: colors.lightGrey,
  borderBottomWidth: 1,
  borderBottomColor: colors.border,
},
});