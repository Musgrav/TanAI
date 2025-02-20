import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProgressScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Your Progress</Text>
        </View>

        {/* Streak Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>14</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>3.2</Text>
            <Text style={styles.statLabel}>Hours</Text>
          </View>
        </View>

        {/* Before/After Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Before & After</Text>
          <TouchableOpacity style={styles.photoButton}>
            <Ionicons name="camera" size={24} color="#FF6B3D" />
            <Text style={styles.photoButtonText}>Take Progress Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Session History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          <View style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionDate}>Today</Text>
              <Text style={styles.sessionDuration}>30 min</Text>
            </View>
            <Text style={styles.sessionDetails}>SPF 30 • UV Index 6 • Sunny</Text>
          </View>
          {/* Add more session cards here */}
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B3D',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
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
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B3D',
    borderStyle: 'dashed',
  },
  photoButtonText: {
    color: '#FF6B3D',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sessionCard: {
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
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  sessionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sessionDuration: {
    fontSize: 16,
    color: '#FF6B3D',
    fontWeight: '600',
  },
  sessionDetails: {
    fontSize: 14,
    color: '#666',
  },
});

export default ProgressScreen; 