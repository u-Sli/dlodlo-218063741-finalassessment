import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import OnboardingStack from './OnBoardingNavigation';
import AuthStack from './AuthStack';
import TabNavigator from './TabNavigation';
import LoadingScreen from '../app/screens/LoadingScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading, isFirstLaunch } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          isFirstLaunch ? (
            <Stack.Screen name="Onboarding" component={OnboardingStack} />
          ) : (
            <Stack.Screen name="Auth" component={AuthStack} />
          )
        ) : (
          <Stack.Screen name="MainApp" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;