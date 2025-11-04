import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ExploreScreen from '../screens/ExploreScreen';
import HotelDetailsScreen from '../screens/HotelDetailsScreen';
import BookingScreen from '../screens/BookingScreen';

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
        </Stack.Navigator>
    );
};

export default MainAppStack;