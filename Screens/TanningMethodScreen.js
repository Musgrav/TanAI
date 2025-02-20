import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const methods = [
  {
    emoji: '☀️',
    title: 'Natural Sun',
    description: 'Outdoor tanning in natural sunlight',
  },
  {
    emoji: '🛏️',
    title: 'Tanning Bed',
    description: 'Indoor tanning using UV beds',
  },
  {
    emoji: '🔄',
    title: 'Combination',
    description: 'Mix of indoor and outdoor tanning',
  },
];

const TanningMethodScreen = ({ route, navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const { gender, timeframe, currentShade, targetShade } = route.params;

  const handleSelect = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedMethod(index);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('TanningFrequency', {
      gender,
      timeframe,
      currentShade,
      targetShade,
      method: methods[selectedMethod].title,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🌅</Text>
        <Text style={styles.title}>Tanning Method</Text>
        <Text style={styles.subtitle}>How would you like to achieve your tan?</Text>

        <View style={styles.methodsContainer}>
          {methods.map((method, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.methodCard,
                selectedMethod === index && styles.selectedMethod
              ]}
              onPress={() => handleSelect(index)}
            >
              <Text style={styles.methodEmoji}>{method.emoji}</Text>
              <Text style={[
                styles.methodTitle,
                selectedMethod === index && styles.selectedText
              ]}>{method.title}</Text>
              <Text style={[
                styles.methodDescription,
                selectedMethod === index && styles.selectedText
              ]}>{method.description}</Text>
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
            selectedMethod === null && styles.disabledButton
          ]}
          disabled={selectedMethod === null}
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
  methodsContainer: {
    gap: 15,
  },
  methodCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMethod: {
    backgroundColor: '#FF6B3D',
    borderColor: '#FF6B3D',
  },
  methodEmoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  methodDescription: {
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

export default TanningMethodScreen; 