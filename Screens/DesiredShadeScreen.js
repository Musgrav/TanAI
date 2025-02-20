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

const DesiredShadeScreen = ({ route, navigation }) => {
  const [selectedShade, setSelectedShade] = useState(null);
  const { gender, goal, timeframe, currentShade } = route.params;

  // Find the index of current shade to filter available options
  const currentShadeIndex = skinShades.findIndex(shade => shade.name === currentShade.name);

  // Only show shades darker than current shade
  const availableShades = skinShades.slice(currentShadeIndex + 1);

  const handleSelectShade = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSelectedShade(currentShadeIndex + 1 + index);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('TanningMethod', {
      gender,
      goal,
      timeframe,
      currentShade,
      targetShade: skinShades[selectedShade],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎯</Text>
        <Text style={styles.title}>Target Skin Tone</Text>
        <Text style={styles.subtitle}>Select your desired skin color</Text>

        <View style={styles.currentShadeContainer}>
          <Text style={styles.currentShadeLabel}>Current:</Text>
          <View 
            style={[
              styles.currentShadeCircle,
              { backgroundColor: currentShade.color }
            ]} 
          />
          <Text style={styles.currentShadeName}>{currentShade.name}</Text>
        </View>

        <View style={styles.shadesGrid}>
          {availableShades.map((shade, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.shadeButton,
                { backgroundColor: shade.color },
                selectedShade === currentShadeIndex + 1 + index && styles.selectedShade
              ]}
              onPress={() => handleSelectShade(index)}
            >
              {selectedShade === currentShadeIndex + 1 + index && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.shadeName}>
          {selectedShade !== null ? skinShades[selectedShade].name : 'Select your target shade'}
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
    marginBottom: 30,
  },
  currentShadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 20,
    width: '100%',
    justifyContent: 'center',
  },
  currentShadeLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  currentShadeCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  currentShadeName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
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

export default DesiredShadeScreen; 