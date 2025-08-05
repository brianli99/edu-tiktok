import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useProgress } from '../contexts/ProgressContext';

const ProfileScreen = () => {
  const { progress, getTotalProgress, resetProgress } = useProgress();

  const categories = [
    { name: 'Data Engineering', color: '#FF6B6B', icon: '⚙️' },
    { name: 'AI & ML', color: '#4ECDC4', icon: '🤖' },
    { name: 'Data Science', color: '#45B7D1', icon: '📊' },
    { name: 'Technology', color: '#96CEB4', icon: '💻' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Learning Profile</Text>
        <Text style={styles.subtitle}>Track your educational journey</Text>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{progress.watchedVideos.length}</Text>
          <Text style={styles.statLabel}>Videos Watched</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{progress.learningStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{Math.round(progress.totalWatchTime / 60)}</Text>
          <Text style={styles.statLabel}>Minutes Learned</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>Overall Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${getTotalProgress()}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(getTotalProgress())}% Complete</Text>
      </View>

      {/* Category Progress */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Category Progress</Text>
        {categories.map((category, index) => (
          <View key={index} style={styles.categoryProgress}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            <View style={styles.categoryProgressBar}>
              <View style={[styles.categoryProgressFill, { 
                width: `${Math.random() * 100}%`,
                backgroundColor: category.color 
              }]} />
            </View>
          </View>
        ))}
      </View>

      {/* Reset Button */}
      <TouchableOpacity style={styles.resetButton} onPress={resetProgress}>
        <Text style={styles.resetButtonText}>Reset Progress</Text>
      </TouchableOpacity>
    </ScrollView>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  progressSection: {
    padding: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
  },
  progressText: {
    color: '#666',
    fontSize: 14,
    marginTop: 10,
  },
  categoriesSection: {
    padding: 20,
  },
  categoryProgress: {
    marginBottom: 15,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  categoryName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryProgressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryProgressFill: {
    height: '100%',
  },
  resetButton: {
    backgroundColor: '#FF6B6B',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
