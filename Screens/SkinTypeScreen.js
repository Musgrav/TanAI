import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const skinTypes = [
  'Very Fair - Always Burns',
  'Fair - Burns Easily',
  'Medium - Sometimes Burns',
  'Olive - Rarely Burns',
  'Brown - Very Rarely Burns',
  'Dark - Never Burns'
];

const SkinTypeScreen = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>What's Your Skin Type?</Text>
        <Text style={styles.subtitle}>This helps us create a safe tanning plan for you</Text>

        <View style={styles.optionsContainer}>
          {skinTypes.map((type, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedType === type && styles.selectedOption
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={[
                styles.optionText,
                selectedType === type && styles.selectedOptionText
              ]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.nextButton, !selectedType && styles.disabledButton]}
          disabled={!selectedType}
          onPress={() => navigation.navigate('TanningGoal', { skinType: selectedType })}
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B3D',
    marginTop: 40,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    paddingHorizontal: 20,
  },
  option: {
    backgroundColor: '#f0f0f0',
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#FF6B3D',
    borderColor: '#FF6B3D',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
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
    fontWeight: 'bold',
  },
});

export default SkinTypeScreen; 