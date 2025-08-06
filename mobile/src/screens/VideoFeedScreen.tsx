import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { EducationalVideo } from '../types';
import { useEducationalVideos } from '../hooks/useEducationalVideos';
import { useVideoPlayback } from '../hooks/useVideoPlayback';
import { formatNumber } from '../utils/formatters';
import VideoPlayer from '../components/VideoPlayer';

const { height, width } = Dimensions.get('window');

const VideoFeedScreen = () => {
  const route = useRoute();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { videos, loading, error, category, fetchVideosByCategory } = useEducationalVideos();

  // Handle navigation from search screen
  useEffect(() => {
    const params = route.params as { videoIndex?: number };
    if (params?.videoIndex !== undefined && flatListRef.current) {
      setCurrentVideoIndex(params.videoIndex);
      flatListRef.current.scrollToIndex({
        index: params.videoIndex,
        animated: true,
      });
    }
  }, [route.params]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentVideoIndex(viewableItems[0].index || 0);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 80,
    minimumViewTime: 300,
  };

  // Helper function to get full video URL
  const getVideoUrl = (videoUrl: string) => {
    // If it's already a full URL, return as is
    if (videoUrl.startsWith('http')) {
      return videoUrl;
    }
    // If it's a relative path, prepend the backend URL
    return `http://localhost:8000${videoUrl}`;
  };

  const renderVideoItem = useCallback(({ item, index }: { item: EducationalVideo; index: number }) => {
    const isCurrentVideo = index === currentVideoIndex;
    
    // Use the actual video URL from the API
    const videoUrl = getVideoUrl(item.videoUrl);
    
    return (
      <View style={styles.videoContainer}>
        {/* Video Player */}
        <View style={styles.videoPlayerContainer}>
          <VideoPlayer
            videoUrl={videoUrl}
            thumbnailUrl={item.thumbnailUrl}
            autoPlay={isCurrentVideo}
            loop={false}
            muted={false}
            onPlaybackStatusUpdate={(status) => {
              // Handle playback status updates
              console.log('Playback status:', status);
            }}
            onVideoEnd={() => {
              console.log('Video ended:', item.title);
            }}
            onError={(error) => {
              console.error('Video error:', error);
            }}
          />
        </View>
        
        {/* Video Info Overlay */}
        <View style={styles.videoInfo}>
          <View style={styles.creatorInfo}>
            <Image source={{ uri: item.creatorAvatar }} style={styles.creatorAvatar} />
            <View style={styles.creatorText}>
              <Text style={styles.creatorName}>{item.creator}</Text>
              <Text style={styles.videoTitle}>{item.title}</Text>
              <Text style={styles.videoDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>{item.category.replace('-', ' ').toUpperCase()}</Text>
                <Text style={styles.difficultyText}>• {item.difficulty}</Text>
              </View>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>❤️</Text>
              <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>👁️</Text>
              <Text style={styles.actionText}>{formatNumber(item.views)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>📚</Text>
              <Text style={styles.actionText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionText}>Comment</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }, [currentVideoIndex]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading educational content...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchVideosByCategory(category)}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        removeClippedSubviews={false}
        maxToRenderPerBatch={1}
        windowSize={3}
        initialNumToRender={1}
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoContainer: {
    height: height,
    width: width,
    position: 'relative',
  },
  videoPlayerContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoInfo: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  creatorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  creatorText: {
    flex: 1,
  },
  creatorName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  videoDescription: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 5,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    color: '#FF6B6B',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  difficultyText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  actionButtons: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    alignItems: 'center',
  },
  actionButton: {
    marginBottom: 20,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default VideoFeedScreen;
