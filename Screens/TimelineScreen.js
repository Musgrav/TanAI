import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const TimelineScreen = ({ route, navigation }) => {
  const handleTimeframeSelect = (timeframe) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('FaceScan', {
      ...route.params,
      timeframe,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>⏳</Text>
        <Text style={styles.title}>Choose your timeline</Text>
        <Text style={styles.subtitle}>How long do you want to achieve your goal?</Text>

        <TouchableOpacity
          style={styles.timeframeButton}
          onPress={() => handleTimeframeSelect('2 weeks')}
        >
          <Text style={styles.timeframeEmoji}>🏃</Text>
          <View style={styles.timeframeTextContainer}>
            <Text style={styles.timeframeTitle}>Quick Results</Text>
            <Text style={styles.timeframeDescription}>2 weeks</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.timeframeButton}
          onPress={() => handleTimeframeSelect('3 weeks')}
        >
          <Text style={styles.timeframeEmoji}>⚡</Text>
          <View style={styles.timeframeTextContainer}>
            <Text style={styles.timeframeTitle}>Balanced Approach</Text>
            <Text style={styles.timeframeDescription}>3 weeks</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.timeframeButton}
          onPress={() => handleTimeframeSelect('4 weeks')}
        >
          <Text style={styles.timeframeEmoji}>🌱</Text>
          <View style={styles.timeframeTextContainer}>
            <Text style={styles.timeframeTitle}>Gradual Progress</Text>
            <Text style={styles.timeframeDescription}>4 weeks</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.timeframeButton}
          onPress={() => handleTimeframeSelect('Ongoing maintenance')}
        >
          <Text style={styles.timeframeEmoji}>♾️</Text>
          <View style={styles.timeframeTextContainer}>
            <Text style={styles.timeframeTitle}>Maintenance Mode</Text>
            <Text style={styles.timeframeDescription}>Ongoing</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  timeframeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeframeEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  timeframeTextContainer: {
    flex: 1,
  },
  timeframeTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  timeframeDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default TimelineScreen; 