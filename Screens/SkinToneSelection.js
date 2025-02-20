import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SkinToneSelection = ({ navigation }) => {
  const [selectedTone, setSelectedTone] = useState(null);

  const skinTones = [
    '#FFE4C4',  // bisque
    '#DEB887',  // burlywood
    '#CD853F',  // peru
    '#8B4513',  // saddlebrown
    '#3B2F2F',  // dark brown
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pick your perfect shade</Text>
      <Text style={styles.subtitle}>TanAI uses AI to create a fast and safe tanning routine for your skin type.</Text>
      <View style={styles.tonesContainer}>
        {skinTones.map((tone, index) => (
          <TouchableOpacity 
            key={index} 
            onPress={() => setSelectedTone(index)}
            style={[
              styles.skinTone,
              { backgroundColor: tone },
              selectedTone === index && styles.selectedTone
            ]}
          />
        ))}
      </View>
      <TouchableOpacity
        style={[styles.button, selectedTone === null && styles.disabledButton]}
        disabled={selectedTone === null}
        onPress={() => navigation.navigate('FaceScanScreen')}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#FF6B3D',
    padding: 20
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 10 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#fff', 
    textAlign: 'center', 
    marginBottom: 20,
    paddingHorizontal: 20
  },
  tonesContainer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginBottom: 30 
  },
  skinTone: { 
    width: 50, 
    height: 50, 
    marginHorizontal: 10,
    borderRadius: 25
  },
  selectedTone: { 
    borderWidth: 2, 
    borderColor: '#fff'
  },
  button: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 30, 
    width: '80%', 
    alignItems: 'center' 
  },
  disabledButton: { 
    opacity: 0.5 
  },
  buttonText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#FF6B3D' 
  }
});

export default SkinToneSelection;