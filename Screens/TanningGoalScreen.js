import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import * as Haptics from 'expo-haptics';

const TanningGoalScreen = ({ route, navigation }) => {
  const [selectedGoal, setSelectedGoal] = useState(null);
  const isEditing = route.params?.isEditing;
  const currentPlan = route.params || {};

  const handleGoalSelect = (goal) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedGoal(goal);
    navigation.navigate('Timeline', {
      ...currentPlan,
      goal,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🎯</Text>
        <Text style={styles.title}>What's your tanning goal?</Text>
        <Text style={styles.subtitle}>Choose your desired outcome</Text>

        <TouchableOpacity
          style={styles.goalButton}
          onPress={() => handleGoalSelect('Light Tan')}
        >
          <Text style={styles.goalEmoji}>🌅</Text>
          <View style={styles.goalTextContainer}>
            <Text style={styles.goalTitle}>Light Tan</Text>
            <Text style={styles.goalDescription}>A subtle, natural glow</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.goalButton}
          onPress={() => handleGoalSelect('Medium Tan')}
        >
          <Text style={styles.goalEmoji}>☀️</Text>
          <View style={styles.goalTextContainer}>
            <Text style={styles.goalTitle}>Medium Tan</Text>
            <Text style={styles.goalDescription}>A noticeable, golden tan</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.goalButton}
          onPress={() => handleGoalSelect('Deep Tan')}
        >
          <Text style={styles.goalEmoji}>🌞</Text>
          <View style={styles.goalTextContainer}>
            <Text style={styles.goalTitle}>Deep Tan</Text>
            <Text style={styles.goalDescription}>A rich, dark bronze</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.goalButton}
          onPress={() => handleGoalSelect('Maintain Current')}
        >
          <Text style={styles.goalEmoji}>✨</Text>
          <View style={styles.goalTextContainer}>
            <Text style={styles.goalTitle}>Maintain Current</Text>
            <Text style={styles.goalDescription}>Keep your current tan</Text>
          </View>
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
    fontSize: 48,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  goalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  goalEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  goalTextContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default TanningGoalScreen; 