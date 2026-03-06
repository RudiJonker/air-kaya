import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AUTH_SCREENS } from './NavigationConstants';
import SplashScreen from '../screens/auth/SplashScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={AUTH_SCREENS.SPLASH} component={SplashScreen} />
    </Stack.Navigator>
  );
}