import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Switch,
} from 'react-native';

const exposureTypes = [
  {
    title: 'Natural Sun',
    description: 'Outdoor tanning in natural sunlight'
  },
  {
    title: 'Tanning Bed',
    description: 'Indoor tanning using UV beds'
  },
  {
    title: 'Both',
    description: 'Combination of indoor and outdoor tanning'
  }
];

const frequencies = [
  'Daily',
  'Weekly',
  'Occasionally'
];

const TanningPreferencesScreen = ({ route, navigation }) => {
  const [selectedExposure, setSelectedExposure] = useState(null);
  const [selectedFrequency, setSelectedFrequency] = useState(null);
  const [location, setLocation] = useState('');
  const [usesSunscreen, setUsesSunscreen] = useState(null);
  const [wantsReminders, setWantsReminders] = useState(false);
  const [wantsProgress, setWantsProgress] = useState(false);
  const { goal, timeframe, skinTone, burnTendency } = route.params;

  const handleComplete = () => {
    navigation.navigate('Home', {
      plan: {
        goal,
        timeframe,
        skinTone,
        burnTendency,
        exposureType: selectedExposure,
        frequency: selectedFrequency,
        location,
        usesSunscreen,
        wantsReminders,
        wantsProgress
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Tanning Preferences</Text>
          <Text style={styles.subtitle}>Help us customize your experience</Text>

          <Text style={styles.sectionTitle}>Preferred Tanning Method</Text>
          <View style={styles.optionsContainer}>
            {exposureTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionCard,
                  selectedExposure === type.title && styles.selectedOption
                ]}
                onPress={() => setSelectedExposure(type.title)}
              >
                <Text style={[
                  styles.optionTitle,
                  selectedExposure === type.title && styles.selectedText
                ]}>{type.title}</Text>
                <Text style={[
                  styles.optionDescription,
                  selectedExposure === type.title && styles.selectedText
                ]}>{type.description}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>How often do you plan to tan?</Text>
          <View style={styles.frequencyContainer}>
            {frequencies.map((frequency, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.frequencyButton,
                  selectedFrequency === frequency && styles.selectedFrequency
                ]}
                onPress={() => setSelectedFrequency(frequency)}
              >
                <Text style={[
                  styles.frequencyText,
                  selectedFrequency === frequency && styles.selectedText
                ]}>{frequency}</Text>
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

          <Text style={styles.sectionTitle}>Do you use sunscreen?</Text>
          <View style={styles.sunscreenContainer}>
            {['Yes', 'Sometimes', 'No'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.sunscreenButton,
                  usesSunscreen === option && styles.selectedOption
                ]}
                onPress={() => setUsesSunscreen(option)}
              >
                <Text style={[
                  styles.sunscreenText,
                  usesSunscreen === option && styles.selectedText
                ]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.toggleContainer}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>Hydration & Skincare Reminders</Text>
                <Text style={styles.toggleDescription}>Get notifications for skincare routines</Text>
              </View>
              <Switch
                value={wantsReminders}
                onValueChange={setWantsReminders}
                trackColor={{ false: '#f0f0f0', true: '#FF6B3D' }}
                thumbColor={wantsReminders ? '#fff' : '#fff'}
              />
            </View>

            <View style={styles.toggleRow}>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>Track Progress with Photos</Text>
                <Text style={styles.toggleDescription}>Document your tanning journey</Text>
              </View>
              <Switch
                value={wantsProgress}
                onValueChange={setWantsProgress}
                trackColor={{ false: '#f0f0f0', true: '#FF6B3D' }}
                thumbColor={wantsProgress ? '#fff' : '#fff'}
              />
            </View>
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
            (!selectedExposure || !selectedFrequency || !location || !usesSunscreen) && styles.disabledButton
          ]}
          disabled={!selectedExposure || !selectedFrequency || !location || !usesSunscreen}
          onPress={handleComplete}
        >
          <Text style={styles.nextButtonText}>Create Plan</Text>
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
  frequencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  frequencyButton: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedFrequency: {
    backgroundColor: '#FF6B3D',
    borderColor: '#FF6B3D',
  },
  frequencyText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 15,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  sunscreenContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  sunscreenButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  sunscreenText: {
    fontSize: 16,
    color: '#333',
  },
  toggleContainer: {
    gap: 20,
    marginTop: 20,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 15,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  toggleDescription: {
    fontSize: 14,
    color: '#666',
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

export default TanningPreferencesScreen; 