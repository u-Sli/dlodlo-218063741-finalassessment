import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const BookingScreen = ({ route, navigation }) => {
    const { hotel } = route.params;
    const { user } = useAuth();

    const [checkInDate, setCheckInDate] = useState(new Date());
    const [checkOutDate, setCheckOutDate] = useState(new Date(Date.now() + 86400000));
    const [numberOfRooms, setNumberOfRooms] = useState(1);
    const [numberOfGuests, setNumberOfGuests] = useState(2);
    const [specialRequests, setSpecialRequests] = useState('');
    const [showCheckInPicker, setShowCheckInPicker] = useState(false);
    const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});


    const calculateNights = () => {
        const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        return Math.ceil(timeDiff / (1000 * 3600 * 24));
    };


    const calculateTotal = () => {
        const nights = calculateNights();
        return nights * hotel.price * numberOfRooms;
    };


    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);


        if (!user) {
            newErrors.auth = 'Please sign in to book a hotel';
        }


        if (checkInDate < today) {
            newErrors.checkInDate = 'Check-in date cannot be in the past';
        }


        if (checkOutDate <= checkInDate) {
            newErrors.checkOutDate = 'Check-out date must be after check-in date';
        }


        if (numberOfRooms < 1 || numberOfRooms > 10) {
            newErrors.numberOfRooms = 'Number of rooms must be between 1 and 10';
        }


        if (numberOfGuests < 1 || numberOfGuests > (numberOfRooms * 4)) {
            newErrors.numberOfGuests = `Maximum ${numberOfRooms * 4} guests for ${numberOfRooms} room(s)`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBookNow = () => {
        if (!validateForm()) return;
        setShowConfirmation(true);
    };

    const handleConfirmBooking = async () => {
        setLoading(true);

        try {

            await new Promise(resolve => setTimeout(resolve, 2000));


            const booking = {
                id: Date.now().toString(),
                hotel: hotel,
                checkInDate: checkInDate.toISOString(),
                checkOutDate: checkOutDate.toISOString(),
                numberOfRooms,
                numberOfGuests,
                specialRequests,
                totalPrice: calculateTotal(),
                status: 'confirmed',
                bookedAt: new Date().toISOString(),
                userId: user.uid
            };



            setShowConfirmation(false);


            Alert.alert(
                'Booking Confirmed!',
                `Your booking at ${hotel.name} has been confirmed. Total: $${calculateTotal()}`,
                [
                    {
                        text: 'View Bookings',
                        onPress: () => navigation.navigate('Bookings')
                    },
                    {
                        text: 'Back to Hotels',
                        onPress: () => navigation.navigate('Explore')
                    }
                ]
            );

        } catch (error) {
            Alert.alert('Booking Failed', 'There was an error processing your booking. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const onCheckInChange = (event, selectedDate) => {
        setShowCheckInPicker(false);
        if (selectedDate) {
            setCheckInDate(selectedDate);

            if (checkOutDate <= selectedDate) {
                const newCheckOut = new Date(selectedDate);
                newCheckOut.setDate(newCheckOut.getDate() + 1);
                setCheckOutDate(newCheckOut);
            }
        }
    };

    const onCheckOutChange = (event, selectedDate) => {
        setShowCheckOutPicker(false);
        if (selectedDate) {
            setCheckOutDate(selectedDate);
        }
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <View style={styles.authRequired}>
                    <Text style={styles.authTitle}>Sign In Required</Text>
                    <Text style={styles.authText}>Please sign in to book this hotel</Text>
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

            <View style={styles.hotelSummary}>
                <Text style={styles.hotelName}>{hotel.name}</Text>
                <Text style={styles.hotelLocation}>{hotel.location}</Text>
                <Text style={styles.hotelPrice}>${hotel.price} / night</Text>
            </View>


            <View style={styles.form}>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Check-in Date</Text>
                    <TouchableOpacity
                        style={[styles.dateInput, errors.checkInDate && styles.inputError]}
                        onPress={() => setShowCheckInPicker(true)}
                    >
                        <Text style={styles.dateText}>{formatDate(checkInDate)}</Text>
                    </TouchableOpacity>
                    {errors.checkInDate && <Text style={styles.errorText}>{errors.checkInDate}</Text>}
                </View>


                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Check-out Date</Text>
                    <TouchableOpacity
                        style={[styles.dateInput, errors.checkOutDate && styles.inputError]}
                        onPress={() => setShowCheckOutPicker(true)}
                    >
                        <Text style={styles.dateText}>{formatDate(checkOutDate)}</Text>
                    </TouchableOpacity>
                    {errors.checkOutDate && <Text style={styles.errorText}>{errors.checkOutDate}</Text>}
                </View>


                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Number of Rooms</Text>
                    <View style={styles.counterContainer}>
                        <TouchableOpacity
                            style={styles.counterButton}
                            onPress={() => setNumberOfRooms(Math.max(1, numberOfRooms - 1))}
                        >
                            <Text style={styles.counterButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>{numberOfRooms}</Text>
                        <TouchableOpacity
                            style={styles.counterButton}
                            onPress={() => setNumberOfRooms(Math.min(10, numberOfRooms + 1))}
                        >
                            <Text style={styles.counterButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    {errors.numberOfRooms && <Text style={styles.errorText}>{errors.numberOfRooms}</Text>}
                </View>


                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Number of Guests</Text>
                    <View style={styles.counterContainer}>
                        <TouchableOpacity
                            style={styles.counterButton}
                            onPress={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}
                        >
                            <Text style={styles.counterButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.counterValue}>{numberOfGuests}</Text>
                        <TouchableOpacity
                            style={styles.counterButton}
                            onPress={() => setNumberOfGuests(Math.min(numberOfRooms * 4, numberOfGuests + 1))}
                        >
                            <Text style={styles.counterButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    {errors.numberOfGuests && <Text style={styles.errorText}>{errors.numberOfGuests}</Text>}
                </View>


                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Special Requests (Optional)</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Any special requirements or requests..."
                        value={specialRequests}
                        onChangeText={setSpecialRequests}
                        multiline
                        numberOfLines={3}
                        textAlignVertical="top"
                    />
                </View>


                <View style={styles.priceSummary}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>${hotel.price} × {calculateNights()} nights</Text>
                        <Text style={styles.priceValue}>${hotel.price * calculateNights()}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>× {numberOfRooms} room(s)</Text>
                        <Text style={styles.priceValue}>${calculateTotal()}</Text>
                    </View>
                    <View style={[styles.priceRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>${calculateTotal()}</Text>
                    </View>
                </View>


                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={handleBookNow}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.bookButtonText}>Book Now</Text>
                    )}
                </TouchableOpacity>
            </View>


            {showCheckInPicker && (
                <DateTimePicker
                    value={checkInDate}
                    mode="date"
                    display="default"
                    onChange={onCheckInChange}
                    minimumDate={new Date()}
                />
            )}

            {showCheckOutPicker && (
                <DateTimePicker
                    value={checkOutDate}
                    mode="date"
                    display="default"
                    onChange={onCheckOutChange}
                    minimumDate={new Date(checkInDate.getTime() + 86400000)}
                />
            )}


            <Modal
                visible={showConfirmation}
                transparent={true}
                animationType="slide"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirm Booking</Text>

                        <View style={styles.confirmationDetails}>
                            <Text style={styles.confirmationHotel}>{hotel.name}</Text>
                            <Text style={styles.confirmationLocation}>{hotel.location}</Text>

                            <View style={styles.confirmationRow}>
                                <Text style={styles.confirmationLabel}>Check-in:</Text>
                                <Text style={styles.confirmationValue}>{formatDate(checkInDate)}</Text>
                            </View>

                            <View style={styles.confirmationRow}>
                                <Text style={styles.confirmationLabel}>Check-out:</Text>
                                <Text style={styles.confirmationValue}>{formatDate(checkOutDate)}</Text>
                            </View>

                            <View style={styles.confirmationRow}>
                                <Text style={styles.confirmationLabel}>Duration:</Text>
                                <Text style={styles.confirmationValue}>{calculateNights()} nights</Text>
                            </View>

                            <View style={styles.confirmationRow}>
                                <Text style={styles.confirmationLabel}>Rooms:</Text>
                                <Text style={styles.confirmationValue}>{numberOfRooms}</Text>
                            </View>

                            <View style={styles.confirmationRow}>
                                <Text style={styles.confirmationLabel}>Guests:</Text>
                                <Text style={styles.confirmationValue}>{numberOfGuests}</Text>
                            </View>

                            <View style={[styles.confirmationRow, styles.confirmationTotal]}>
                                <Text style={styles.totalLabel}>Total:</Text>
                                <Text style={styles.totalValue}>${calculateTotal()}</Text>
                            </View>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowConfirmation(false)}
                                disabled={loading}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={handleConfirmBooking}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    authRequired: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
    hotelSummary: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        backgroundColor: '#f8f9fa',
    },
    hotelName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    hotelLocation: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    hotelPrice: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FF5A5F',
    },
    form: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 16,
        backgroundColor: '#fafafa',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 8,
        backgroundColor: '#fafafa',
    },
    counterButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FF5A5F',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    counterValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 16,
        fontSize: 16,
        backgroundColor: '#fafafa',
        minHeight: 80,
    },
    inputError: {
        borderColor: '#ff3b30',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 14,
        marginTop: 4,
    },
    priceSummary: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    priceLabel: {
        fontSize: 14,
        color: '#666',
    },
    priceValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 8,
        marginTop: 8,
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF5A5F',
    },
    bookButton: {
        backgroundColor: '#FF5A5F',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    bookButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        width: '100%',
        maxWidth: 400,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    confirmationDetails: {
        marginBottom: 24,
    },
    confirmationHotel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    confirmationLocation: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
    },
    confirmationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    confirmationLabel: {
        fontSize: 14,
        color: '#666',
    },
    confirmationValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    confirmationTotal: {
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        paddingTop: 8,
        marginTop: 8,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    confirmButton: {
        backgroundColor: '#FF5A5F',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default BookingScreen;