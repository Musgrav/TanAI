import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ShareTemplate = ({ title, description, onPress }) => (
  <TouchableOpacity style={styles.templateCard} onPress={onPress}>
    <View style={styles.templatePreview}>
      <Ionicons name="image-outline" size={40} color="#FF6B3D" />
    </View>
    <View style={styles.templateInfo}>
      <Text style={styles.templateTitle}>{title}</Text>
      <Text style={styles.templateDescription}>{description}</Text>
    </View>
    <Ionicons name="chevron-forward" size={24} color="#666" />
  </TouchableOpacity>
);

const ShareScreen = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Share Progress</Text>
        </View>

        {/* Quick Share Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Share</Text>
          <View style={styles.quickShareButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-instagram" size={24} color="#fff" />
              <Text style={styles.socialButtonText}>Instagram Story</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, styles.snapchatButton]}>
              <Ionicons name="logo-snapchat" size={24} color="#fff" />
              <Text style={styles.socialButtonText}>Snapchat Story</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Story Templates */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Story Templates</Text>
          <ShareTemplate
            title="Before & After"
            description="Show your transformation with side-by-side photos"
            onPress={() => setSelectedTemplate('before-after')}
          />
          <ShareTemplate
            title="Progress Timeline"
            description="Share your journey with a photo timeline"
            onPress={() => setSelectedTemplate('timeline')}
          />
          <ShareTemplate
            title="Stats Overview"
            description="Share your tanning achievements and stats"
            onPress={() => setSelectedTemplate('stats')}
          />
        </View>

        {/* Custom Caption Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suggested Captions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.captionScroll}>
            <TouchableOpacity style={styles.captionBubble}>
              <Text style={styles.captionText}>🌞 Day {14} of my tanning journey!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.captionBubble}>
              <Text style={styles.captionText}>✨ Feeling confident and glowing!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.captionBubble}>
              <Text style={styles.captionText}>🎯 Halfway to my goal!</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  quickShareButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E4405F',
    padding: 15,
    borderRadius: 12,
    gap: 8,
  },
  snapchatButton: {
    backgroundColor: '#FFFC00',
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  templateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  templatePreview: {
    width: 60,
    height: 60,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  templateInfo: {
    flex: 1,
  },
  templateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: '#666',
  },
  captionScroll: {
    flexGrow: 0,
  },
  captionBubble: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 20,
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  captionText: {
    fontSize: 14,
    color: '#333',
  },
});

export default ShareScreen; 