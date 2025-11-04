// App.jsx
import React from 'react';
import { View } from 'react-native';
import FirebaseTest from './app/FirebaseTest';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <FirebaseTest />
    </View>
  );
}