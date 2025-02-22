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
import Slider from '@react-native-community/slider';

// Fitzpatrick scale colors with undertones
const skinShades = {
  'TYPE I': { color: '#FFE4D6', name: 'Very Light' },
  'TYPE II': { color: '#FFD5BA', name: 'Light' },
  'TYPE III': { color: '#E8B88A', name: 'Medium Light' },
  'TYPE IV': { color: '#C99C67', name: 'Medium' },
  'TYPE V': { color: '#8C593B', name: 'Medium Dark' },
  'TYPE VI': { color: '#643D26', name: 'Dark' },
};

// Helper function to interpolate between colors
const interpolateColor = (color1, color2, factor) => {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);
  
  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const DesiredShadeScreen = ({ route, navigation }) => {
  const { gender, goal, timeframe, currentShade } = route.params;
  
  // Find the current shade index
  const shadeTypes = Object.keys(skinShades);
  const currentIndex = shadeTypes.findIndex(type => 
    skinShades[type].name === currentShade.name
  );
  
  const [sliderValue, setSliderValue] = useState(currentIndex * 20);
  
  // Calculate available range (can only go darker)
  const minValue = currentIndex * 20;
  const maxValue = (shadeTypes.length - 1) * 20;

  const getInterpolatedColor = (value) => {
    const baseIndex = Math.floor(value / 20);
    const nextIndex = Math.min(baseIndex + 1, shadeTypes.length - 1);
    const factor = (value % 20) / 20;
    
    const color1 = skinShades[shadeTypes[baseIndex]].color;
    const color2 = skinShades[shadeTypes[nextIndex]].color;
    
    return interpolateColor(color1, color2, factor);
  };

  const getCurrentShadeName = (value) => {
    const baseIndex = Math.floor(value / 20);
    return skinShades[shadeTypes[baseIndex]].name;
  };

  const handleSliderChange = (value) => {
    if (value !== sliderValue) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSliderValue(value);
    }
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const baseIndex = Math.floor(sliderValue / 20);
    const selectedType = shadeTypes[baseIndex];
    navigation.navigate('TanningMethod', {
      gender,
      goal,
      timeframe,
      currentShade,
      targetShade: {
        ...skinShades[selectedType],
        type: selectedType,
        color: getInterpolatedColor(sliderValue)
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎯</Text>
        <Text style={styles.title}>Target Skin Tone</Text>
        <Text style={styles.subtitle}>Adjust the slider to select your desired shade</Text>

        <View style={styles.shadeDisplayContainer}>
          <View style={styles.shadeBox}>
            <Text style={styles.shadeLabel}>Current</Text>
            <View style={[styles.colorCircle, { backgroundColor: skinShades[shadeTypes[currentIndex]].color }]} />
            <Text style={styles.shadeName}>{skinShades[shadeTypes[currentIndex]].name}</Text>
          </View>
          
          <View style={styles.arrow}>
            <Text style={styles.arrowText}>→</Text>
          </View>
          
          <View style={styles.shadeBox}>
            <Text style={styles.shadeLabel}>Target</Text>
            <View style={[styles.colorCircle, { backgroundColor: getInterpolatedColor(sliderValue) }]} />
            <Text style={styles.shadeName}>{getCurrentShadeName(sliderValue)}</Text>
          </View>
        </View>

        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={minValue}
            maximumValue={maxValue}
            value={sliderValue}
            onValueChange={handleSliderChange}
            step={1}
            minimumTrackTintColor="#FF6B3D"
            maximumTrackTintColor="#D1D1D6"
            thumbTintColor="#FF6B3D"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>Lighter</Text>
            <Text style={styles.sliderLabel}>Darker</Text>
          </View>
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
          style={styles.nextButton}
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
  shadeDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 20,
    marginBottom: 40,
  },
  shadeBox: {
    alignItems: 'center',
    flex: 1,
  },
  arrow: {
    paddingHorizontal: 10,
  },
  arrowText: {
    fontSize: 24,
    color: '#666',
  },
  shadeLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  colorCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  shadeName: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginBottom: 5,
  },
  sliderContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 14,
    color: '#666',
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
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default DesiredShadeScreen; 