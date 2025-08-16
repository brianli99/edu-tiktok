import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { EducationalVideo } from '../types';
import { formatNumber } from '../utils/formatters';
import VideoPlayer from './VideoPlayer';

interface VideoItemProps {
  item: EducationalVideo;
  index: number;
  isCurrentVideo: boolean;
  onVideoPress?: () => void;
}

const VideoItem = memo<VideoItemProps>(({ item, index, isCurrentVideo, onVideoPress }) => {
  // Helper function to get full video URL
  const getVideoUrl = (videoUrl: string) => {
    // If it's already a full URL, return as is
    if (videoUrl.startsWith('http')) {
      return videoUrl;
    }
    // If it's a relative path, prepend the backend URL
    return `http://localhost:8000${videoUrl}`;
  };

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
            console.error('Video error for', item.title, ':', error);
            console.log('Video URL:', videoUrl);
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
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

VideoItem.displayName = 'VideoItem';

const styles = StyleSheet.create({
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  videoPlayerContainer: {
    flex: 1,
  },
  videoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  creatorInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 16,
  },
  creatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  creatorText: {
    flex: 1,
  },
  creatorName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  videoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  videoDescription: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryText: {
    color: '#4ECDC4',
    fontSize: 12,
    fontWeight: '600',
  },
  difficultyText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.7,
    marginLeft: 4,
  },
  actionButtons: {
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 16,
    minWidth: 50,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default VideoItem;
