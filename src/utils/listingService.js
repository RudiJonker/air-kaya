import { supabase } from '../config/supabase';
import * as FileSystem from 'expo-file-system/legacy';

export const listingService = {

  createListing: async (listingData) => {
    return await supabase
      .from('listings')
      .insert(listingData)
      .select()
      .single();
  },

  updateListing: async (id, updates) => {
    return await supabase
      .from('listings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  },

  deleteListing: async (id) => {
    return await supabase
      .from('listings')
      .update({ status: 'deleted' })
      .eq('id', id);
  },

  getLandlordListings: async (landlordId) => {
    return await supabase
      .from('listings')
      .select('*, listing_images(*)')
      .eq('landlord_id', landlordId)
      .neq('status', 'deleted')
      .order('created_at', { ascending: false });
  },

  getActiveListings: async (city) => {
    let query = supabase
      .from('listings')
      .select('*, listing_images(*), profiles(full_name, avatar_url)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (city) query = query.ilike('city', `%${city}%`);

    return await query;
  },

  getListingById: async (id) => {
    return await supabase
      .from('listings')
      .select('*, listing_images(*), profiles(full_name, avatar_url, phone)')
      .eq('id', id)
      .single();
  },

  uploadImage: async (listingId, imageUri, index) => {
    try {
      const ext = imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${listingId}/${index}_${Date.now()}.${ext}`;
      const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;

      // Read as base64 instead of fetch/blob (works in Expo Go on Android)
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Convert base64 to Uint8Array
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(fileName, bytes, { contentType, upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('listing-images')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('listing_images')
        .insert({
          listing_id: listingId,
          url: urlData.publicUrl,
          order_index: index,
        });

      if (dbError) throw dbError;

      return { url: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('Image upload error:', error);
      return { url: null, error };
    }
  },

  deleteImage: async (listingId, imageUrl) => {
    const fileName = imageUrl.split('/listing-images/')[1];
    await supabase.storage.from('listing-images').remove([fileName]);
    return await supabase
      .from('listing_images')
      .delete()
      .eq('listing_id', listingId)
      .eq('url', imageUrl);
  },

};