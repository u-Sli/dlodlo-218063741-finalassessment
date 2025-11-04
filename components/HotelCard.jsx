import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions
} from 'react-native';

const { width } = Dimensions.get('window');

const HotelCard = ({ hotel, onPress }) => {
    const renderStars = (stars) => {
        let starText = '';
        for (let i = 0; i < stars; i++) {
            starText += '★';
        }
        return starText;
    };

    return (
        <TouchableOpacity style={styles.card} onPress={() => onPress(hotel)}>
            <Image source={{ uri: hotel.image }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.name} numberOfLines={1}>{hotel.name}</Text>
                    <Text style={styles.price}>${hotel.price}/night</Text>
                </View>

                <View style={styles.locationContainer}>
                    <Text style={styles.location} numberOfLines={1}>{hotel.location}</Text>
                </View>

                <View style={styles.ratingContainer}>
                    <View style={styles.starsContainer}>
                        <Text style={styles.stars}>{renderStars(hotel.stars)}</Text>
                        <Text style={styles.rating}>({hotel.rating})</Text>
                    </View>
                </View>

                <View style={styles.amenities}>
                    <Text style={styles.amenitiesText} numberOfLines={1}>
                        {hotel.amenities.slice(0, 3).join(' • ')}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    content: {
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 8,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FF5A5F',
    },
    locationContainer: {
        marginBottom: 8,
    },
    location: {
        fontSize: 14,
        color: '#666',
    },
    ratingContainer: {
        marginBottom: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stars: {
        fontSize: 14,
        marginRight: 4,
        color: '#FFD700',
    },
    rating: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    amenities: {
        marginTop: 4,
    },
    amenitiesText: {
        fontSize: 12,
        color: '#888',
    },
});

export default HotelCard;