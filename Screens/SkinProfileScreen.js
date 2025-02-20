import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const skinTones = [
  {
    title: 'Light',
    description: 'Fair or pale skin'
  },
  {
    title: 'Medium',
    description: 'Beige or olive skin'
  },
  {
    title: 'Dark',
    description: 'Brown or deep skin'
  }
];

const burnTendencies = [
  {
    title: 'Always',
    description: 'Burns easily, rarely tans'
  },
  {
    title: 'Sometimes',
    description: 'Burns moderately, tans gradually'
  },
  {
    title: 'Rarely',
    description: 'Rarely burns, tans easily'
  }
];

const SkinProfileScreen = ({ route, navigation }) => {
  const [selectedTone, setSelectedTone] = useState(null);
  const [selectedBurnTendency, setSelectedBurnTendency] = useState(null);
  const { goal, timeframe } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Tell us about your skin</Text>
          <Text style={styles.subtitle}>This helps us create a safe tanning plan</Text>

          <Text style={styles.sectionTitle}>What is your current skin tone?</Text>
          <View style={styles.optionsContainer}>
            {skinTones.map((tone, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  selectedTone === tone.title && styles.selectedOption
                ]}
                onPress={() => setSelectedTone(tone.title)}
              >
                <Text style={[
                  styles.optionTitle,
                  selectedTone === tone.title && styles.selectedText
                ]}>{tone.title}</Text>
                <Text style={[
                  styles.optionDescription,
                  selectedTone === tone.title && styles.selectedText
                ]}>{tone.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>How easily do you burn?</Text>
          <View style={styles.optionsContainer}>
            {burnTendencies.map((tendency, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  selectedBurnTendency === tendency.title && styles.selectedOption
                ]}
                onPress={() => setSelectedBurnTendency(tendency.title)}
              >
                <Text style={[
                  styles.optionTitle,
                  selectedBurnTendency === tendency.title && styles.selectedText
                ]}>{tendency.title}</Text>
                <Text style={[
                  styles.optionDescription,
                  selectedBurnTendency === tendency.title && styles.selectedText
                ]}>{tendency.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            (!selectedTone || !selectedBurnTendency) && styles.disabledButton
          ]}
          disabled={!selectedTone || !selectedBurnTendency}
          onPress={() => navigation.navigate('TanningPreferences', {
            goal,
            timeframe,
            skinTone: selectedTone,
            burnTendency: selectedBurnTendency
          })}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B3D',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 30,
    marginBottom: 20,
  },
  optionsContainer: {
    gap: 15,
    marginBottom: 20,
  },
  optionCard: {
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
  optionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
    color: '#666',
  },
  selectedText: {
    color: '#fff',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
});

export default SkinProfileScreen; 