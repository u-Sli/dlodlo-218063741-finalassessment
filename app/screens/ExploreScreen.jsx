import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    Alert
} from 'react-native';
import { sampleHotels } from '../../data/Hotels';
import HotelCard from '../../components/HotelCard';

const { width } = Dimensions.get('window');

const ExploreScreen = ({ navigation }) => {
    const [hotels, setHotels] = useState(sampleHotels);
    const [filteredHotels, setFilteredHotels] = useState(sampleHotels);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('rating-high-low');
    const [filterBy, setFilterBy] = useState('all');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showSortModal, setShowSortModal] = useState(false);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        setLoading(true);

        let results = [...hotels];


        if (searchQuery) {
            results = results.filter(hotel =>
                hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }


        if (filterBy !== 'all') {
            switch (filterBy) {
                case '4-stars':
                    results = results.filter(hotel => hotel.stars === 4);
                    break;
                case '5-stars':
                    results = results.filter(hotel => hotel.stars === 5);
                    break;
                case 'beachfront':
                    results = results.filter(hotel =>
                        hotel.amenities.some(amenity =>
                            amenity.toLowerCase().includes('beach')
                        )
                    );
                    break;
                case 'luxury':
                    results = results.filter(hotel =>
                        hotel.stars >= 4 && hotel.price >= 300
                    );
                    break;
            }
        }


        switch (sortBy) {
            case 'price-low-high':
                results.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-low':
                results.sort((a, b) => b.price - a.price);
                break;
            case 'rating-high-low':
                results.sort((a, b) => b.rating - a.rating);
                break;
            case 'name-a-z':
                results.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }


        setTimeout(() => {
            setFilteredHotels(results);
            setLoading(false);
        }, 500);
    }, [searchQuery, sortBy, filterBy, hotels]);

    const handleHotelPress = (hotel) => {
        navigation.navigate('HotelDetails', { hotel });
    };

    const renderHotelItem = ({ item }) => (
        <HotelCard hotel={item} onPress={handleHotelPress} />
    );

    const renderEmptyState = () => (
        <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No hotels found</Text>
            <Text style={styles.emptyStateText}>
                Try adjusting your search or filters to find more options.
            </Text>
        </View>
    );

    const SortModal = () => (
        <Modal
            visible={showSortModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowSortModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Sort By</Text>

                    {[
                        { key: 'rating-high-low', label: 'Highest Rating' },
                        { key: 'price-low-high', label: 'Price: Low to High' },
                        { key: 'price-high-low', label: 'Price: High to Low' },
                        { key: 'name-a-z', label: 'Name: A to Z' }
                    ].map((option) => (
                        <TouchableOpacity
                            key={option.key}
                            style={styles.modalOption}
                            onPress={() => {
                                setSortBy(option.key);
                                setShowSortModal(false);
                            }}
                        >
                            <Text style={styles.modalOptionText}>{option.label}</Text>
                            {sortBy === option.key && <View style={styles.selectedDot} />}
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={styles.modalClose}
                        onPress={() => setShowSortModal(false)}
                    >
                        <Text style={styles.modalCloseText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const FilterModal = () => (
        <Modal
            visible={showFilterModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowFilterModal(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Filter By</Text>

                    {[
                        { key: 'all', label: 'All Hotels' },
                        { key: '5-stars', label: '5 Stars' },
                        { key: '4-stars', label: '4 Stars' },
                        { key: 'beachfront', label: 'Beachfront' },
                        { key: 'luxury', label: 'Luxury (4+ stars, $300+)' }
                    ].map((option) => (
                        <TouchableOpacity
                            key={option.key}
                            style={styles.modalOption}
                            onPress={() => {
                                setFilterBy(option.key);
                                setShowFilterModal(false);
                            }}
                        >
                            <Text style={styles.modalOptionText}>{option.label}</Text>
                            {filterBy === option.key && <View style={styles.selectedDot} />}
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity
                        style={styles.modalClose}
                        onPress={() => setShowFilterModal(false)}
                    >
                        <Text style={styles.modalCloseText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    const getSortLabel = () => {
        const sortOptions = {
            'rating-high-low': 'Highest Rating',
            'price-low-high': 'Price: Low to High',
            'price-high-low': 'Price: High to Low',
            'name-a-z': 'Name: A to Z'
        };
        return sortOptions[sortBy];
    };

    const getFilterLabel = () => {
        const filterOptions = {
            'all': 'All Hotels',
            '5-stars': '5 Stars',
            '4-stars': '4 Stars',
            'beachfront': 'Beachfront',
            'luxury': 'Luxury'
        };
        return filterOptions[filterBy];
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <Text style={styles.title}>Find Your Perfect Stay</Text>
                <Text style={styles.subtitle}>Discover amazing hotels worldwide</Text>
            </View>


            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search hotels or locations..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    clearButtonMode="while-editing"
                />
            </View>


            <View style={styles.controlsContainer}>
                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setShowFilterModal(true)}
                >
                    <Text style={styles.controlButtonText}>Filter: {getFilterLabel()}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setShowSortModal(true)}
                >
                    <Text style={styles.controlButtonText}>Sort: {getSortLabel()}</Text>
                </TouchableOpacity>
            </View>


            <View style={styles.resultsContainer}>
                <Text style={styles.resultsText}>
                    {filteredHotels.length} {filteredHotels.length === 1 ? 'hotel' : hotels} found
                </Text>
            </View>


            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FF5A5F" />
                    <Text style={styles.loadingText}>Finding the best hotels...</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredHotels}
                    renderItem={renderHotelItem}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmptyState}
                    contentContainerStyle={styles.listContent}
                />
            )}


            <SortModal />
            <FilterModal />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    searchContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    searchInput: {
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    controlsContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    controlButton: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e9ecef',
        marginHorizontal: 4,
        alignItems: 'center',
    },
    controlButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    resultsContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
    },
    resultsText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    listContent: {
        paddingTop: 8,
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
        marginTop: 60,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        lineHeight: 22,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalOptionText: {
        fontSize: 16,
        color: '#333',
    },
    selectedDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#FF5A5F',
    },
    modalClose: {
        marginTop: 20,
        padding: 16,
        backgroundColor: '#FF5A5F',
        borderRadius: 12,
        alignItems: 'center',
    },
    modalCloseText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ExploreScreen;