import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const frequencies = [
  {
    emoji: '📆',
    title: 'Daily',
    description: 'Regular sessions every day',
    value: '7',
  },
  {
    emoji: '🗓️',
    title: 'Weekly',
    description: '2-3 sessions per week',
    value: '2-3',
  },
  {
    emoji: '🌙',
    title: 'Occasionally',
    description: 'Flexible sessions when possible',
    value: '1',
  },
];

const TanningFrequencyScreen = ({ route, navigation }) => {
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const { gender, timeframe, currentShade, targetShade, method } = route.params;

  const handleSelect = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedFrequency(index);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Location', {
      gender,
      timeframe,
      currentShade,
      targetShade,
      method,
      frequency: frequencies[selectedFrequency].title,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>⏰</Text>
        <Text style={styles.title}>Session Frequency</Text>
        <Text style={styles.subtitle}>How often would you like to tan?</Text>

        <View style={styles.frequencyContainer}>
          {frequencies.map((freq, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.frequencyCard,
                selectedFrequency === index && styles.selectedFrequency
              ]}
              onPress={() => handleSelect(index)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.frequencyEmoji}>{freq.emoji}</Text>
                <View style={styles.sessionsContainer}>
                  <Text style={[
                    styles.sessionsValue,
                    selectedFrequency === index && styles.selectedText
                  ]}>{freq.value}</Text>
                  <Text style={[
                    styles.sessionsLabel,
                    selectedFrequency === index && styles.selectedText
                  ]}>sessions/week</Text>
                </View>
              </View>
              <Text style={[
                styles.frequencyTitle,
                selectedFrequency === index && styles.selectedText
              ]}>{freq.title}</Text>
              <Text style={[
                styles.frequencyDescription,
                selectedFrequency === index && styles.selectedText
              ]}>{freq.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            selectedFrequency === null && styles.disabledButton
          ]}
          disabled={selectedFrequency === null}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
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
  },
  emoji: {
    fontSize: 40,
    textAlign: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  frequencyContainer: {
    gap: 15,
  },
  frequencyCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFrequency: {
    backgroundColor: '#FF6B3D',
    borderColor: '#FF6B3D',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  frequencyEmoji: {
    fontSize: 32,
  },
  sessionsContainer: {
    alignItems: 'flex-end',
  },
  sessionsValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  sessionsLabel: {
    fontSize: 12,
    color: '#666',
  },
  frequencyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  frequencyDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
  bottomContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  backButton: {
    backgroundColor: '#f5f5f5',
    padding: 18,
    borderRadius: 30,
    width: '45%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#FF6B3D',
    padding: 18,
    borderRadius: 30,
    width: '45%',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default TanningFrequencyScreen; 