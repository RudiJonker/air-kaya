import mobileAds from 'react-native-google-mobile-ads';

export const initAdMob = async () => {
  try {
    await mobileAds().initialize();
    console.log('✅ AdMob initialized');
  } catch (error) {
    console.error('❌ AdMob init error:', error);
  }
};

// Use test IDs during development
// Replace with real IDs before Play Store submission
export const AD_UNIT_ID = __DEV__
  ? 'ca-app-pub-3940256099942544/6300978111'  // Google test banner ID
  : 'ca-app-pub-4450705098283366/3926590806'; // Your real banner ID