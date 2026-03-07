import React from 'react';
import {
  View, Text, TouchableOpacity,
  Image, StyleSheet, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { colors, spacing, fonts } from '../../styles/theme';

const MAX_PHOTOS = 6;

export default function PhotosField({ value = [], onChange }) {
  const pickImage = async () => {
    if (value.length >= MAX_PHOTOS) {
      Alert.alert('Maximum Photos', `You can upload up to ${MAX_PHOTOS} photos.`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Please allow access to your photo library.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const compressed = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 1024 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      onChange([...value, compressed.uri]);
    }
  };

  const removeImage = (index) => {
    Alert.alert('Remove Photo', 'Remove this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => onChange(value.filter((_, i) => i !== index)),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Photos</Text>
      <Text style={styles.sectionSubtitle}>
        Add up to {MAX_PHOTOS} photos. First photo is the cover image.
      </Text>

      <View style={styles.grid}>
        {value.map((uri, index) => (
          <TouchableOpacity
            key={index}
            style={styles.photoThumb}
            onPress={() => removeImage(index)}
            activeOpacity={0.8}
          >
            <Image source={{ uri }} style={styles.photo} />
            <View style={styles.removeBadge}>
              <Text style={styles.removeBadgeText}>✕</Text>
            </View>
            {index === 0 && (
              <View style={styles.coverBadge}>
                <Text style={styles.coverBadgeText}>Cover</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}

        {value.length < MAX_PHOTOS && (
          <TouchableOpacity style={styles.addBtn} onPress={pickImage}>
            <Text style={styles.addBtnIcon}>📷</Text>
            <Text style={styles.addBtnText}>Add Photo</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fonts.large,
    fontWeight: '700',
    color: colors.dark,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fonts.body,
    color: colors.grey,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  photoThumb: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removeBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  coverBadge: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: colors.primary,
    borderRadius: 4,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
  },
  coverBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  addBtn: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightGrey,
  },
  addBtnIcon: { fontSize: 24, marginBottom: spacing.xs },
  addBtnText: {
    fontSize: fonts.small,
    color: colors.grey,
    fontWeight: '600',
  },
});