import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet
} from 'react-native';
import { colors, spacing, fonts } from '../../styles/theme';


export default function CityAutocomplete({ value, onSelectCity, placeholder = 'Search city...' }) {
  const [suggestions, setSuggestions] = useState([]);

  const debounceTimer = useRef(null);

const handleSearch = async (text) => {
  onSelectCity(text, null);
  if (text.length < 3) {
    setSuggestions([]);
    return;
  }
  
  // Clear previous timer
  if (debounceTimer.current) clearTimeout(debounceTimer.current);
  
  // Wait 500ms after user stops typing
  debounceTimer.current = setTimeout(async () => {
    try {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&countrycodes=za&format=json&addressdetails=1&limit=5`,
    { headers: { 'User-Agent': 'AirKaya/1.0 (airkaya@gmail.com)' } }
  );
  const rawText = await response.text();
 
  const data = JSON.parse(rawText);
  const results = data
    .filter(item => item.address?.city || item.address?.town || item.address?.village)
    .map(item => ({
      city: item.address?.city || item.address?.town || item.address?.village,
      province: item.address?.state || '',
      display: `${item.address?.city || item.address?.town || item.address?.village}, ${item.address?.state || ''}`,
    }))
    .filter((item, index, self) =>
      index === self.findIndex(t => t.city === item.city)
    );
  setSuggestions(results);
} catch (error) {
  console.log('Autocomplete error:', error);
}
}, 500);
};

  const handleSelect = (item) => {
    setSuggestions([]);
    onSelectCity(item.city, item.province);
  };

  return (
  <View style={styles.wrapper}>
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={handleSearch}
        placeholder={placeholder}
        placeholderTextColor={colors.grey}
        autoCapitalize="words"
      />
      {suggestions.length > 0 && (
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={() => setSuggestions([])}
        >
          <Text style={styles.clearBtnText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
    {suggestions.length > 0 && (
      <View style={styles.suggestionsBox}>
        {suggestions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionRow}
            onPress={() => handleSelect(item)}
          >
            <Text style={styles.suggestionText}>{item.display}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fonts.body,
    color: colors.dark,
    backgroundColor: colors.white,
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
  inputRow: {
  flexDirection: 'row',
  alignItems: 'center',
},
clearBtn: {
  position: 'absolute',
  right: spacing.sm,
  padding: spacing.xs,
},
clearBtnText: {
  fontSize: fonts.medium,
  color: colors.grey,
},
});