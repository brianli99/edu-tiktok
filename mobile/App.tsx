import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProgressProvider } from './src/contexts/ProgressContext';

import VideoFeedScreen from './src/screens/VideoFeedScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SearchScreen from './src/screens/SearchScreen';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ProgressProvider>
        <NavigationContainer>
          <Stack.Navigator 
            screenOptions={{ 
              headerShown: false,
              gestureEnabled: true,
              animationEnabled: true
            }}
          >
            <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
            <Stack.Screen name="VideoFeed" component={VideoFeedScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
          </Stack.Navigator>
          <StatusBar style="light" />
        </NavigationContainer>
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
