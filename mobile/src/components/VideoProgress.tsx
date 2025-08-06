import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface VideoProgressProps {
  progress: number;
  isCompleted: boolean;
  currentTime: number;
  duration: number;
  showProgress?: boolean;
}

const VideoProgress: React.FC<VideoProgressProps> = ({
  progress,
  isCompleted,
  currentTime,
  duration,
  showProgress = true,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showProgress) return null;

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min(progress, 100)}%` }
            ]} 
          />
        </View>
        
        {/* Time Display */}
        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>
      </View>

      {/* Completion Status */}
      {isCompleted && (
        <View style={styles.completionBadge}>
          <Text style={styles.completionText}>✓ Completed</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
  },
  progressContainer: {
    marginBottom: 5,
  },
  progressBar: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  completionBadge: {
    position: 'absolute',
    top: -30,
    right: 10,
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  completionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default VideoProgress; 