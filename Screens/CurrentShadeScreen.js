import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const skinShades = [
  { color: '#FFE4C4', name: 'Very Light' },  // Bisque
  { color: '#F5DEB3', name: 'Light' },       // Wheat
  { color: '#DEB887', name: 'Light Medium' }, // Burlywood
  { color: '#D2B48C', name: 'Medium' },      // Tan
  { color: '#B3612E', name: 'Medium Deep' },  // RosyBrown
  { color: '#8B4513', name: 'Deep' },        // SaddleBrown
];

const CurrentShadeScreen = ({ route, navigation }) => {
  const [selectedShade, setSelectedShade] = useState(null);
  const { gender, goal, timeframe } = route.params;

  const handleSelectShade = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedShade(index);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('DesiredShade', {
      gender,
      goal,
      timeframe,
      currentShade: skinShades[selectedShade],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎨</Text>
        <Text style={styles.title}>Current Skin Tone</Text>
        <Text style={styles.subtitle}>Select your natural skin color</Text>

        <View style={styles.shadesGrid}>
          {skinShades.map((shade, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.shadeButton,
                { backgroundColor: shade.color },
                selectedShade === index && styles.selectedShade
              ]}
              onPress={() => handleSelectShade(index)}
            >
              {selectedShade === index && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.shadeName}>
          {selectedShade !== null ? skinShades[selectedShade].name : 'Select your shade'}
        </Text>
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
            selectedShade === null && styles.disabledButton
          ]}
          disabled={selectedShade === null}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');
const SHADE_SIZE = (width - 80) / 3;

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
  shadesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'center',
    marginBottom: 20,
    width: '100%',
    maxWidth: 400,
  },
  shadeButton: {
    width: SHADE_SIZE,
    height: SHADE_SIZE,
    borderRadius: SHADE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedShade: {
    borderColor: '#FF6B3D',
    borderWidth: 3,
  },
  checkmark: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  shadeName: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
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

export default CurrentShadeScreen; 