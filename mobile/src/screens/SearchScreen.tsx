import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { EducationalVideo } from '../types';
import { useEducationalVideos } from '../hooks/useEducationalVideos';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'all', name: 'All Videos', icon: '📺', color: '#FF6B6B' },
  { id: 'data-engineering', name: 'Data Engineering', icon: '⚙️', color: '#4ECDC4' },
  { id: 'programming', name: 'Programming', icon: '💻', color: '#45B7D1' },
  { id: 'machine-learning', name: 'Machine Learning', icon: '🤖', color: '#96CEB4' },
  { id: 'web-development', name: 'Web Development', icon: '🌐', color: '#FFA07A' },
  { id: 'mobile-development', name: 'Mobile Development', icon: '📱', color: '#DDA0DD' },
];

const SearchScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { videos, loading, error, fetchVideosByCategory, searchVideos } = useEducationalVideos();
  const [filteredVideos, setFilteredVideos] = useState<EducationalVideo[]>([]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredVideos(videos);
    } else {
      const categoryVideos = videos.filter(video => video.category === selectedCategory);
      setFilteredVideos(categoryVideos);
    }
  }, [videos, selectedCategory]);

  useEffect(() => {
    if (searchQuery.trim()) {
      // Filter videos based on search query
      const searchResults = videos.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredVideos(searchResults);
    } else {
      // Reset to category filter
      if (selectedCategory === 'all') {
        setFilteredVideos(videos);
      } else {
        const categoryVideos = videos.filter(video => video.category === selectedCategory);
        setFilteredVideos(categoryVideos);
      }
    }
  }, [searchQuery, videos, selectedCategory]);

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchQuery(''); // Clear search when changing category
    if (categoryId === 'all') {
      // Fetch all videos
      fetchVideosByCategory('all');
    } else {
      // Fetch videos by category
      fetchVideosByCategory(categoryId);
    }
  };

  const renderCategory = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity 
      style={[
        styles.categoryCard, 
        { backgroundColor: item.color },
        selectedCategory === item.id && styles.selectedCategory
      ]}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleVideoPress = (video: EducationalVideo) => {
    // Find the index of the video in the main videos array
    const videoIndex = videos.findIndex(v => v.id === video.id);
    if (videoIndex !== -1) {
      // Navigate to Learn tab and pass the video index
      navigation.navigate('Learn' as never, { videoIndex } as never);
    }
  };

  const renderVideo = ({ item }: { item: EducationalVideo }) => (
    <TouchableOpacity 
      style={styles.videoCard}
      onPress={() => handleVideoPress(item)}
    >
      <Image 
        source={{ uri: item.thumbnailUrl }} 
        style={styles.videoThumbnail}
        resizeMode="cover"
      />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.videoCreator}>{item.creator}</Text>
        <View style={styles.videoStats}>
          <Text style={styles.videoDuration}>{Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}</Text>
          <Text style={styles.videoViews}>{item.views} views</Text>
        </View>
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>{item.category.replace('-', ' ').toUpperCase()}</Text>
          <Text style={styles.difficultyText}>• {item.difficulty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Discover Educational Content</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for topics, creators..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>

      {/* Videos */}
      <View style={styles.videosSection}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? `Search Results (${filteredVideos.length})` : `${selectedCategory === 'all' ? 'All' : categories.find(c => c.id === selectedCategory)?.name} Videos (${filteredVideos.length})`}
        </Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading videos...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <FlatList
            data={filteredVideos}
            renderItem={renderVideo}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.videosContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#333',
    color: '#fff',
    padding: 15,
    borderRadius: 25,
    fontSize: 16,
  },
  categoriesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    marginRight: 15,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCategory: {
    borderColor: '#fff',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  videosSection: {
    flex: 1,
  },
  videosContainer: {
    padding: 20,
  },
  videoCard: {
    flex: 1,
    margin: 5,
    backgroundColor: '#333',
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoThumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: '#444',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoCreator: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 4,
  },
  videoStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  videoDuration: {
    color: '#999',
    fontSize: 11,
  },
  videoViews: {
    color: '#999',
    fontSize: 11,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    color: '#FF6B6B',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  difficultyText: {
    color: '#4ECDC4',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SearchScreen;
