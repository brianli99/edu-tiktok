import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image } from 'react-native';
import { EducationalVideo, Category } from '../types';

const categories: Category[] = [
  { id: '1', name: 'Data Engineering', icon: '⚙️', color: '#FF6B6B', description: 'ETL, pipelines, data architecture' },
  { id: '2', name: 'AI & ML', icon: '🤖', color: '#4ECDC4', description: 'Machine learning, neural networks' },
  { id: '3', name: 'Data Science', icon: '📊', color: '#45B7D1', description: 'Analytics, statistics, visualization' },
  { id: '4', name: 'Technology', icon: '💻', color: '#96CEB4', description: 'Programming, tools, frameworks' },
];

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity style={[styles.categoryCard, { backgroundColor: item.color }]}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryDescription}>{item.description}</Text>
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
      
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.categoriesContainer}
      />
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
  categoriesContainer: {
    padding: 20,
  },
  categoryCard: {
    flex: 1,
    margin: 5,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    minHeight: 120,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  categoryName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  categoryDescription: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default SearchScreen;
