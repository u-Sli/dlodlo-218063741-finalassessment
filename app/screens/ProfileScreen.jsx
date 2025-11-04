import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Alert,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const mockBookings = [
    {
        id: '1',
        hotelName: 'Grand Plaza Hotel',
        hotelImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
        checkInDate: '2024-02-15',
        checkOutDate: '2024-02-18',
        totalPrice: 897,
        numberOfRooms: 1,
        status: 'confirmed',
        bookedAt: '2024-01-20'
    },
    {
        id: '2',
        hotelName: 'Beach Paradise Resort',
        hotelImage: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&h=300&fit=crop',
        checkInDate: '2024-03-10',
        checkOutDate: '2024-03-15',
        totalPrice: 1995,
        numberOfRooms: 1,
        status: 'confirmed',
        bookedAt: '2024-01-18'
    },
    {
        id: '3',
        hotelName: 'Mountain View Lodge',
        hotelImage: 'https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=500&h=300&fit=crop',
        checkInDate: '2024-04-05',
        checkOutDate: '2024-04-08',
        totalPrice: 597,
        numberOfRooms: 1,
        status: 'pending',
        bookedAt: '2024-01-25'
    }
];

const ProfileScreen = ({ navigation }) => {
    const { user, userData, logout, updateProfile } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        displayName: '',
        email: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                displayName: user.displayName || userData?.firstName ? `${userData.firstName} ${userData.lastName}` : 'User',
                email: user.email || ''
            });

            loadBookings();
        }
    }, [user, userData]);

    const loadBookings = async () => {
        setLoading(true);

        setTimeout(() => {
            setBookings(mockBookings);
            setLoading(false);
        }, 1000);
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error) {
                            Alert.alert('Logout Error', 'Failed to logout. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const handleEditProfile = () => {
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        if (!profileData.displayName.trim()) {
            Alert.alert('Error', 'Please enter your name');
            return;
        }

        setEditingProfile(true);
        try {
            const result = await updateProfile({
                displayName: profileData.displayName.trim()
            });

            if (result.success) {
                setIsEditing(false);
                Alert.alert('Success', 'Profile updated successfully');
            } else {
                Alert.alert('Error', result.error || 'Failed to update profile');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setEditingProfile(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset to original values
        setProfileData({
            displayName: user.displayName || userData?.firstName ? `${userData.firstName} ${userData.lastName}` : 'User',
            email: user.email || ''
        });
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return '#4CAF50';
            case 'pending':
                return '#FF9800';
            case 'cancelled':
                return '#F44336';
            default:
                return '#666';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'confirmed':
                return 'Confirmed';
            case 'pending':
                return 'Pending';
            case 'cancelled':
                return 'Cancelled';
            default:
                return status;
        }
    };

    // Ensure boolean values for all boolean props
    const isEditingProfile = !!editingProfile;
    const isLoadingBookings = !!loading;
    const isUserAuthenticated = !!user;

    if (!isUserAuthenticated) {
        return (
            <View style={styles.container}>
                <View style={styles.authRequired}>
                    <Text style={styles.authTitle}>Sign In Required</Text>
                    <Text style={styles.authText}>Please sign in to view your profile</Text>
                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={() => navigation.navigate('Auth')}
                    >
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {profileData.displayName ? profileData.displayName.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                </View>
                
                {isEditing ? (
                    <View style={styles.editForm}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Full Name</Text>
                            <TextInput
                                style={styles.textInput}
                                value={profileData.displayName}
                                onChangeText={(text) => setProfileData({ ...profileData, displayName: text })}
                                placeholder="Enter your full name"
                            />
                        </View>
                        
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={[styles.textInput, styles.disabledInput]}
                                value={profileData.email}
                                editable={false}
                                placeholder="Email cannot be changed"
                            />
                            <Text style={styles.helperText}>
                                Email address cannot be modified
                            </Text>
                        </View>
                        
                        <View style={styles.editButtons}>
                            <TouchableOpacity
                                style={[styles.editButton, styles.cancelButton]}
                                onPress={handleCancelEdit}
                                disabled={isEditingProfile}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[styles.editButton, styles.saveButton]}
                                onPress={handleSaveProfile}
                                disabled={isEditingProfile}
                            >
                                {isEditingProfile ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Save</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <>
                        <Text style={styles.userName}>{profileData.displayName}</Text>
                        <Text style={styles.userEmail}>{profileData.email}</Text>
                        
                        <TouchableOpacity
                            style={styles.editProfileButton}
                            onPress={handleEditProfile}
                        >
                            <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>My Bookings</Text>

                {isLoadingBookings ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#FF5A5F" />
                        <Text style={styles.loadingText}>Loading bookings...</Text>
                    </View>
                ) : bookings.length === 0 ? (
                    <View style={styles.noBookings}>
                        <Text style={styles.noBookingsTitle}>No bookings yet</Text>
                        <Text style={styles.noBookingsText}>
                            Start exploring hotels and book your perfect stay!
                        </Text>
                        <TouchableOpacity
                            style={styles.exploreButton}
                            onPress={() => navigation.navigate('Explore')}
                        >
                            <Text style={styles.exploreButtonText}>Explore Hotels</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.bookingsList}>
                        {bookings.map((booking) => (
                            <View key={booking.id} style={styles.bookingCard}>
                                <Image
                                    source={{ uri: booking.hotelImage }}
                                    style={styles.bookingImage}
                                />
                                <View style={styles.bookingDetails}>
                                    <Text style={styles.bookingHotelName}>{booking.hotelName}</Text>

                                    <View style={styles.bookingDates}>
                                        <Text style={styles.bookingDate}>
                                            {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                                        </Text>
                                    </View>

                                    <View style={styles.bookingMeta}>
                                        <Text style={styles.bookingRooms}>
                                            {booking.numberOfRooms} {booking.numberOfRooms === 1 ? 'room' : 'rooms'}
                                        </Text>
                                        <Text style={styles.bookingPrice}>
                                            ${booking.totalPrice}
                                        </Text>
                                    </View>

                                    <View style={styles.bookingStatus}>
                                        <View
                                            style={[
                                                styles.statusBadge,
                                                { backgroundColor: getStatusColor(booking.status) }
                                            ]}
                                        >
                                            <Text style={styles.statusText}>
                                                {getStatusText(booking.status)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    authRequired: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        minHeight: 400,
    },
    authTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    authText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
    },
    signInButton: {
        backgroundColor: '#FF5A5F',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        backgroundColor: '#fff',
        padding: 24,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    avatarContainer: {
        marginBottom: 16,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FF5A5F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    editProfileButton: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#dee2e6',
    },
    editProfileButtonText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '600',
    },
    editForm: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 16,
        width: '100%',
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fafafa',
        width: '100%',
    },
    disabledInput: {
        backgroundColor: '#f5f5f5',
        color: '#666',
    },
    helperText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    editButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    editButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
    },
    cancelButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    saveButton: {
        backgroundColor: '#FF5A5F',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '600',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    section: {
        backgroundColor: '#fff',
        marginTop: 16,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    loadingContainer: {
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    noBookings: {
        alignItems: 'center',
        padding: 40,
    },
    noBookingsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    noBookingsText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    exploreButton: {
        backgroundColor: '#FF5A5F',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 20,
    },
    exploreButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    bookingsList: {
        gap: 12,
    },
    bookingCard: {
        flexDirection: 'row',
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    bookingImage: {
        width: 80,
        height: 100,
        resizeMode: 'cover',
    },
    bookingDetails: {
        flex: 1,
        padding: 12,
    },
    bookingHotelName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    bookingDates: {
        marginBottom: 6,
    },
    bookingDate: {
        fontSize: 14,
        color: '#666',
    },
    bookingMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    bookingRooms: {
        fontSize: 12,
        color: '#666',
    },
    bookingPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FF5A5F',
    },
    bookingStatus: {
        alignSelf: 'flex-start',
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ProfileScreen;