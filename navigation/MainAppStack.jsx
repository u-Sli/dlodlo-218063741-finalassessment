import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreScreen from '../app/screens/ExploreScreen';
import HotelDetailsScreen from '../app/screens/HotelDetailsScreen';
import BookingScreen from '../app/screens/BookingScreen';
import ProfileScreen from '../app/screens/ProfileScreen';

const Stack = createStackNavigator();

const MainAppStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Explore"
                component={ExploreScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
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
            <Stack.Screen
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
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    title: 'My Profile',
                    headerStyle: {
                        backgroundColor: '#FF5A5F',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
        </Stack.Navigator>
    );
};

export default MainAppStack;