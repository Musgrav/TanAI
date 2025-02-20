import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const genderOptions = [
  {
    title: 'Male',
    emoji: '👨',
  },
  {
    title: 'Female',
    emoji: '👩',
  },
  {
    title: 'Other',
    emoji: '🧑',
  },
];

const GenderScreen = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState(null);

  const handleSelect = (gender) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedGender(gender);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('TanningGoal', { gender: selectedGender });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to TanAI</Text>
        <Text style={styles.subtitle}>Let's personalize your tanning journey</Text>

        <View style={styles.optionsContainer}>
          {genderOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionCard,
                selectedGender === option.title && styles.selectedOption
              ]}
              onPress={() => handleSelect(option.title)}
            >
              <Text style={styles.optionEmoji}>{option.emoji}</Text>
              <Text style={[
                styles.optionTitle,
                selectedGender === option.title && styles.selectedText
              ]}>{option.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.nextButton,
            !selectedGender && styles.disabledButton
          ]}
          disabled={!selectedGender}
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
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF6B3D',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsContainer: {
    gap: 15,
    marginBottom: 40,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: '#FF6B3D',
    borderColor: '#FF6B3D',
  },
  optionEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  selectedText: {
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#FF6B3D',
    padding: 18,
    borderRadius: 30,
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

export default GenderScreen; 