import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const HotelDetailsScreen = ({ route, navigation }) => {
    const { hotel: initialHotel } = route.params;
    const { user } = useAuth();

    const [hotel, setHotel] = useState(initialHotel);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 0,
        comment: '',
        userName: user?.displayName || 'Anonymous User'
    });
    const [userHasReviewed, setUserHasReviewed] = useState(false);

    const handleBookNow = () => {
        if (!user) {
            navigation.navigate('Auth');
            return;
        }
        navigation.navigate('Booking', { hotel });
    };

    const handleAddReview = () => {
        if (!user) {
            Alert.alert('Sign In Required', 'Please sign in to add a review.');
            return;
        }
        setShowReviewModal(true);
    };

    const handleSubmitReview = () => {
        if (newReview.rating === 0) {
            Alert.alert('Rating Required', 'Please select a star rating.');
            return;
        }

        if (newReview.comment.trim().length < 10) {
            Alert.alert('Review Too Short', 'Please write a review with at least 10 characters.');
            return;
        }

        const review = {
            id: Date.now().toString(),
            userName: newReview.userName,
            rating: newReview.rating,
            comment: newReview.comment.trim(),
            date: new Date().toISOString().split('T')[0]
        };


        const updatedHotel = {
            ...hotel,
            reviews: [review, ...hotel.reviews]
        };

        setHotel(updatedHotel);
        setUserHasReviewed(true);
        setShowReviewModal(false);


        setNewReview({
            rating: 0,
            comment: '',
            userName: user?.displayName || 'Anonymous User'
        });

        Alert.alert('Review Submitted', 'Thank you for your review!');
    };

    const renderStars = (rating, size = 16, onPress) => {
        return (
            <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        onPress={() => onPress && onPress(star)}
                        disabled={!onPress}
                    >
                        <Text style={[styles.star, { fontSize: size }]}>
                            {star <= rating ? '★' : '☆'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const calculateAverageRating = () => {
        if (hotel.reviews.length === 0) return 0;
        const total = hotel.reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / hotel.reviews.length).toFixed(1);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollContent}>
                <Image source={{ uri: hotel.image }} style={styles.image} />

                <View style={styles.content}>
                    <Text style={styles.name}>{hotel.name}</Text>
                    <Text style={styles.location}>{hotel.location}</Text>

                    <View style={styles.ratingContainer}>
                        <View style={styles.hotelRating}>
                            {renderStars(hotel.stars, 18)}
                            <Text style={styles.ratingText}>{hotel.rating} Rating</Text>
                        </View>
                        <Text style={styles.price}>${hotel.price}/night</Text>
                    </View>

                    <Text style={styles.description}>{hotel.description}</Text>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Amenities</Text>
                        {hotel.amenities.map((amenity, index) => (
                            <Text key={index} style={styles.amenity}>• {amenity}</Text>
                        ))}
                    </View>


                    <View style={styles.section}>
                        <View style={styles.reviewsHeader}>
                            <View>
                                <Text style={styles.sectionTitle}>Guest Reviews</Text>
                                <Text style={styles.reviewsSummary}>
                                    {hotel.reviews.length} reviews • {calculateAverageRating()} average rating
                                </Text>
                            </View>
                            {user && !userHasReviewed && (
                                <TouchableOpacity
                                    style={styles.addReviewButton}
                                    onPress={handleAddReview}
                                >
                                    <Text style={styles.addReviewButtonText}>Add Review</Text>
                                </TouchableOpacity>
                            )}
                            {userHasReviewed && (
                                <View style={styles.reviewedBadge}>
                                    <Text style={styles.reviewedBadgeText}>Reviewed</Text>
                                </View>
                            )}
                        </View>

                        {hotel.reviews.length === 0 ? (
                            <View style={styles.noReviews}>
                                <Text style={styles.noReviewsText}>No reviews yet</Text>
                                <Text style={styles.noReviewsSubtext}>
                                    Be the first to share your experience at this hotel
                                </Text>
                                {user && (
                                    <TouchableOpacity
                                        style={styles.addFirstReviewButton}
                                        onPress={handleAddReview}
                                    >
                                        <Text style={styles.addFirstReviewButtonText}>Write First Review</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : (
                            <View style={styles.reviewsList}>
                                {hotel.reviews.map((review) => (
                                    <View key={review.id} style={styles.reviewItem}>
                                        <View style={styles.reviewHeader}>
                                            <View style={styles.reviewerInfo}>
                                                <Text style={styles.reviewerName}>{review.userName}</Text>
                                                <Text style={styles.reviewDate}>{formatDate(review.date)}</Text>
                                            </View>
                                            {renderStars(review.rating)}
                                        </View>
                                        <Text style={styles.reviewComment}>{review.comment}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>


            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={handleBookNow}
                >
                    <Text style={styles.bookButtonText}>
                        {user ? 'Book Now' : 'Sign In to Book'}
                    </Text>
                </TouchableOpacity>
            </View>


            <Modal
                visible={showReviewModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowReviewModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Write a Review</Text>

                        <View style={styles.ratingSection}>
                            <Text style={styles.ratingLabel}>Your Rating</Text>
                            <View style={styles.starsInput}>
                                {renderStars(newReview.rating, 32, (rating) =>
                                    setNewReview({ ...newReview, rating })
                                )}
                            </View>
                            <Text style={styles.ratingValue}>
                                {newReview.rating > 0 ? `${newReview.rating} stars` : 'Select rating'}
                            </Text>
                        </View>

                        <View style={styles.commentSection}>
                            <Text style={styles.commentLabel}>Your Review</Text>
                            <TextInput
                                style={styles.commentInput}
                                placeholder="Share your experience at this hotel..."
                                value={newReview.comment}
                                onChangeText={(text) => setNewReview({ ...newReview, comment: text })}
                                multiline
                                numberOfLines={6}
                                textAlignVertical="top"
                                maxLength={500}
                            />
                            <Text style={styles.charCount}>
                                {newReview.comment.length}/500 characters
                            </Text>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowReviewModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalButton, styles.submitButton]}
                                onPress={handleSubmitReview}
                                disabled={newReview.rating === 0 || newReview.comment.trim().length < 10}
                            >
                                <Text style={styles.submitButtonText}>Submit Review</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    content: {
        padding: 20,
        paddingBottom: 100,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    location: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    ratingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    hotelRating: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 8,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FF5A5F',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        marginBottom: 30,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    amenity: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
        marginLeft: 8,
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    reviewsSummary: {
        fontSize: 14,
        color: '#666',
    },
    addReviewButton: {
        backgroundColor: '#FF5A5F',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addReviewButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    reviewedBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    reviewedBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    noReviews: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    noReviewsText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    noReviewsSubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 20,
    },
    addFirstReviewButton: {
        backgroundColor: '#FF5A5F',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    addFirstReviewButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    reviewsList: {
        gap: 16,
    },
    reviewItem: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    reviewerInfo: {
        flex: 1,
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    reviewDate: {
        fontSize: 12,
        color: '#666',
    },
    reviewComment: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    star: {
        color: '#FFD700',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
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
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    ratingSection: {
        alignItems: 'center',
        marginBottom: 24,
    },
    ratingLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    starsInput: {
        marginBottom: 8,
    },
    ratingValue: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    commentSection: {
        marginBottom: 24,
    },
    commentLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    commentInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fafafa',
        minHeight: 120,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        color: '#666',
        textAlign: 'right',
        marginTop: 4,
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
    submitButton: {
        backgroundColor: '#FF5A5F',
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default HotelDetailsScreen;