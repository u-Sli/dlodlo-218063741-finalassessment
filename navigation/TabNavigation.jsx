// src/navigation/TabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreScreen from '../app/screens/ExploreScreen';
import ProfileScreen from '../app/screens/ProfileScreen';
import HotelDetailsScreen from '../app/screens/HotelDetailsScreen';
import BookingScreen from '../app/screens/BookingScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const ExploreStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const ExploreStackNavigator = () => {
    return (
        <ExploreStack.Navigator>
            <ExploreStack.Screen
                name="ExploreMain"
                component={ExploreScreen}
                options={{ headerShown: false }}
            />
            <ExploreStack.Screen
                name="HotelDetails"
                component={HotelDetailsScreen}
                options={{
                    title: 'Hotel Details',
                    headerStyle: {
                        backgroundColor: '#FF5A5F',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <ExploreStack.Screen
                name="Booking"
                component={BookingScreen}
                options={{
                    title: 'Book Your Stay',
                    headerStyle: {
                        backgroundColor: '#FF5A5F',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
        </ExploreStack.Navigator>
    );
};

const ProfileStackNavigator = () => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen
                name="ProfileMain"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
        </ProfileStack.Navigator>
    );
};

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#FF5A5F',
                tabBarInactiveTintColor: '#666',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#e9ecef',
                },
            }}
        >
            <Tab.Screen
                name="ExploreTab"
                component={ExploreStackNavigator}
                options={{
                    headerShown: false,
                    title: 'Explore',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="search" size={size} color={color} />
                    ),
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStackNavigator}
                options={{
                    headerShown: false,
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;