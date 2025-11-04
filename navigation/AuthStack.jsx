import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignInScreen from '../app/screens/SignInScreen';
import SignUpScreen from '../app/screens/SignUpScreen';
import ForgotPasswordScreen from '../app/screens//ForgotPasswordScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: '#fff' }
      }}
    >
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;