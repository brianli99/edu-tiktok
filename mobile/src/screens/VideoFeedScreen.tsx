import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableOpacity, Image } from 'react-native';
import { Video } from 'expo-video';
import { EducationalVideo } from '../types';
import { mockVideos } from '../data/mockVideos';

const { height, width } = Dimensions.get('window');

const VideoFeedScreen = () => {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<Video>(null);

  const renderVideoItem = ({ item, index }: { item: EducationalVideo; index: number }) => {
    return (
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: item.videoUrl }}
          style={styles.video}
          shouldPlay={index === currentVideoIndex}
          isLooping
          resizeMode="cover"
          useNativeControls={false}
        />
        
        {/* Video Info Overlay */}
        <View style={styles.videoInfo}>
          <View style={styles.creatorInfo}>
            <Image source={{ uri: item.creatorAvatar }} style={styles.creatorAvatar} />
            <View style={styles.creatorText}>
              <Text style={styles.creatorName}>{item.creator}</Text>
              <Text style={styles.videoTitle}>{item.title}</Text>
              <Text style={styles.videoDescription}>{item.description}</Text>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>❤️</Text>
              <Text style={styles.actionText}>{item.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionIcon}>👁️</Text>
              <Text style={styles.actionText}>{item.views}</Text>
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
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockVideos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={({ viewableItems }) => {
          if (viewableItems.length > 0) {
            setCurrentVideoIndex(viewableItems[0].index || 0);
          }
        }}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    height: height,
    width: width,
    position: 'relative',
  },
  video: {
    flex: 1,
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
