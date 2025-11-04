import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen1 = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/images/Files/Materials/01-Onboarding-Page/Onboarding-1.png')} 
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Discover Amazing Hotels</Text>
      <Text style={styles.description}>
        Browse through thousands of hotels worldwide and find your perfect stay with detailed information and photos.
      </Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Onboarding2')}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#FF5A5F',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingScreen1;