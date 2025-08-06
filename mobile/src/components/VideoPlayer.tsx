import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import VideoProgress from './VideoProgress';

const { width, height } = Dimensions.get('window');

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  onPlaybackStatusUpdate?: (status: AVPlaybackStatus) => void;
  onVideoEnd?: () => void;
  onError?: (error: string) => void;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showProgress?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  thumbnailUrl,
  onPlaybackStatusUpdate,
  onVideoEnd,
  onError,
  autoPlay = false,
  loop = false,
  muted = false,
  showProgress = true,
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    // Auto-hide controls after 3 seconds
    if (showControls && isPlaying) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showControls, isPlaying]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      if (status.error) {
        setError(`Video playback error: ${status.error}`);
        onError?.(`Video playback error: ${status.error}`);
      }
      return;
    }

    setIsLoading(false);
    setIsPlaying(status.isPlaying);
    setCurrentTime(status.positionMillis / 1000);
    setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);

    // Calculate progress percentage
    if (status.durationMillis) {
      const progressPercent = (status.positionMillis / status.durationMillis) * 100;
      setProgress(progressPercent);
      
      // Mark as completed if watched more than 90%
      if (progressPercent >= 90) {
        setIsCompleted(true);
      }
    }

    // Handle video end
    if (status.didJustFinish) {
      onVideoEnd?.();
    }

    onPlaybackStatusUpdate?.(status);
  };

  const togglePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
    }
  };

  const handleVideoPress = () => {
    setShowControls(!showControls);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.loadAsync({ uri: videoUrl });
    }
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load video</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.videoContainer}
        onPress={handleVideoPress}
        activeOpacity={1}
      >
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={styles.video}
          useNativeControls={false}
          resizeMode={ResizeMode.COVER}
          shouldPlay={autoPlay}
          isLooping={loop}
          isMuted={muted}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          onError={(error) => {
            setError(`Video error: ${error}`);
            onError?.(`Video error: ${error}`);
          }}
        />

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}

        {/* Play/Pause Button Overlay */}
        {!isPlaying && !isLoading && (
          <View style={styles.playButtonOverlay}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={togglePlayPause}
            >
              <Ionicons name="play" size={40} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* Controls Overlay */}
        {showControls && (
          <View style={styles.controlsOverlay}>
            <View style={styles.controlsTop}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => setShowControls(false)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.controlsCenter}>
              <TouchableOpacity
                style={styles.playPauseButton}
                onPress={togglePlayPause}
              >
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={32}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.controlsBottom}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => {
                  // Handle fullscreen
                  Alert.alert('Fullscreen', 'Fullscreen feature coming soon!');
                }}
              >
                <Ionicons name="expand" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Progress Component */}
        {showProgress && (
          <VideoProgress
            progress={progress}
            isCompleted={isCompleted}
            currentTime={currentTime}
            duration={duration}
            showProgress={showProgress}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    flex: 1,
    position: 'relative',
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 20,
  },
  controlsTop: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  controlsCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  playPauseButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
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
});

export default VideoPlayer; 