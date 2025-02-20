import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';

const skinShades = [
  { color: '#FFE4C4', name: 'Very Light' },  // Bisque
  { color: '#F5DEB3', name: 'Light' },       // Wheat
  { color: '#DEB887', name: 'Light Medium' }, // Burlywood
  { color: '#D2B48C', name: 'Medium' },      // Tan
  { color: '#BC8F8F', name: 'Medium Deep' },  // RosyBrown
  { color: '#8B4513', name: 'Deep' },        // SaddleBrown
];

const ShadeSelector = ({ title, selectedShade, onSelect }) => (
  <View style={styles.selectorContainer}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.shadesGrid}>
      {skinShades.map((shade, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.shadeButton,
            { backgroundColor: shade.color },
            selectedShade === index && styles.selectedShade
          ]}
          onPress={() => onSelect(index)}
        >
          {selectedShade === index && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
    <Text style={styles.shadeName}>
      {selectedShade !== null ? skinShades[selectedShade].name : 'Select a shade'}
    </Text>
  </View>
);

const SkinShadeScreen = ({ route, navigation }) => {
  const [currentShade, setCurrentShade] = useState(null);
  const [targetShade, setTargetShade] = useState(null);
  const { timeframe } = route.params;

  const handleNext = () => {
    navigation.navigate('TanningMethod', {
      timeframe,
      currentShade: skinShades[currentShade],
      targetShade: skinShades[targetShade],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎨</Text>
        <Text style={styles.title}>Your Skin Shades</Text>
        <Text style={styles.subtitle}>Let's find your perfect tan</Text>

        <ShadeSelector
          title="Your current shade"
          selectedShade={currentShade}
          onSelect={setCurrentShade}
        />

        <ShadeSelector
          title="Your desired shade"
          selectedShade={targetShade}
          onSelect={setTargetShade}
        />
      </View>

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
            (!currentShade || !targetShade) && styles.disabledButton
          ]}
          disabled={!currentShade || !targetShade}
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
  selectorContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  shadesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 10,
  },
  shadeButton: {
    width: SHADE_SIZE,
    height: SHADE_SIZE,
    borderRadius: SHADE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedShade: {
    borderColor: '#FF6B3D',
  },
  checkmark: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
  },
  shadeName: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
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

export default SkinShadeScreen; 