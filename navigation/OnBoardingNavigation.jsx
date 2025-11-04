import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OnboardingScreen1 from '../app/screens/OnboardingScreen1';
import OnboardingScreen2 from '../app/screens/OnboardingScreen2';
import OnboardingScreen3 from '../app/screens/OnboardingScreen3';

const Stack = createStackNavigator();

const OnboardingStack = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#fff' }
            }}
        >
            <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
            <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
            <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
        </Stack.Navigator>
    );
};

export default OnboardingStack;