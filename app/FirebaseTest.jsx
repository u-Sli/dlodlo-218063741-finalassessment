// FirebaseTest.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { db } from '../firebase/FirebaseConfig';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const FirebaseTest = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [testData, setTestData] = useState(null);

  // Test connection by reading data
  const testConnection = async () => {
    try {
      console.log('Testing Firebase connection...');
      
      // Try to get documents from a test collection
      const querySnapshot = await getDocs(collection(db, 'test'));
      console.log('Successfully connected to Firestore!');
      console.log('Found documents:', querySnapshot.size);
      
      setIsConnected(true);
      Alert.alert('✅ Success', 'Connected to Firebase Firestore!');
      
    } catch (error) {
      console.error('Firebase connection error:', error);
      setIsConnected(false);
      Alert.alert('❌ Error', `Failed to connect: ${error.message}`);
    }
  };

  // Test writing data
  const testWriteData = async () => {
    try {
      const docRef = await addDoc(collection(db, 'test'), {
        message: 'Hello Firebase!',
        timestamp: new Date(),
        test: true
      });
      console.log('Document written with ID: ', docRef.id);
      Alert.alert('✅ Write Success', `Document ID: ${docRef.id}`);
    } catch (error) {
      console.error('Error writing document: ', error);
      Alert.alert('❌ Write Error', error.message);
    }
  };

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Firebase Connection Test
      </Text>
      
      <Text>
        Status: {isConnected ? '✅ Connected' : '❌ Disconnected'}
      </Text>

      <Button 
        title="Test Connection (Read)" 
        onPress={testConnection}
      />
      
      <Button 
        title="Test Write Data" 
        onPress={testWriteData}
      />
    </View>
  );
};

export default FirebaseTest;