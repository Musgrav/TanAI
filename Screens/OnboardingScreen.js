import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import OpenAI from 'openai';
import { EXPO_PUBLIC_OPENAI_API_KEY } from '@env';

const openai = new OpenAI({
  apiKey: EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for React Native
});

const skinTypes = [
  'Very Fair - Always Burns',
  'Fair - Burns Easily',
  'Medium - Sometimes Burns',
  'Olive - Rarely Burns',
  'Brown - Very Rarely Burns',
  'Dark - Never Burns'
];

const tanningGoals = [
  'Light Natural Glow',
  'Medium Natural Tan',
  'Deep Dark Tan',
  'Gradual Build-up',
  'Event Preparation'
];

const OnboardingScreen = ({ navigation }) => {
  const [selectedSkinType, setSelectedSkinType] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [location, setLocation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeTanningPlan = async () => {
    if (!selectedSkinType || !selectedGoal || !location) {
      Alert.alert('Please fill in all fields');
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Create a personalized tanning plan for someone with the following characteristics:
            - Skin Type: ${selectedSkinType}
            - Tanning Goal: ${selectedGoal}
            - Location: ${location}
            
            Consider safety first, and provide a detailed but concise plan that includes:
            1. Recommended tanning duration
            2. Best times of day
            3. Required protection (SPF)
            4. Frequency of sessions
            5. Expected timeline to reach goal
            6. Safety precautions
            
            Keep the response structured and easy to read.`
          }
        ]
      });

      const plan = response.choices[0].message.content;
      Alert.alert(
        "Your Personalized Tanning Plan",
        plan,
        [
          { 
            text: "Save Plan",
            onPress: () => navigation.navigate('Home', { plan })
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate tanning plan. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Your Tanning Plan</Text>
      
      <Text style={styles.sectionTitle}>Select Your Skin Type</Text>
      <View style={styles.optionsContainer}>
        {skinTypes.map((type, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedSkinType === type && styles.selectedOption
            ]}
            onPress={() => setSelectedSkinType(type)}
          >
            <Text style={[
              styles.optionText,
              selectedSkinType === type && styles.selectedOptionText
            ]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Select Your Goal</Text>
      <View style={styles.optionsContainer}>
        {tanningGoals.map((goal, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              selectedGoal === goal && styles.selectedOption
            ]}
            onPress={() => setSelectedGoal(goal)}
          >
            <Text style={[
              styles.optionText,
              selectedGoal === goal && styles.selectedOptionText
            ]}>{goal}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Your Location</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your city"
        value={location}
        onChangeText={setLocation}
        placeholderTextColor="#666"
      />

      <TouchableOpacity
        style={[styles.button, isAnalyzing && styles.disabledButton]}
        onPress={analyzeTanningPlan}
        disabled={isAnalyzing}
      >
        <Text style={styles.buttonText}>
          {isAnalyzing ? 'Creating Your Plan...' : 'Create Tanning Plan'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B3D',
    marginBottom: 30,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedOption: {
    backgroundColor: '#FF6B3D',
    borderColor: '#FF6B3D',
  },
  optionText: {
    color: '#333',
    fontSize: 16,
  },
  selectedOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#FF6B3D',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen; 