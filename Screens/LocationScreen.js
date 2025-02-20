import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import * as Location from 'expo-location';
import OpenAI from 'openai';
import * as Haptics from 'expo-haptics';
import { EXPO_PUBLIC_OPENAI_API_KEY } from '@env';

const openai = new OpenAI({
  apiKey: EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for React Native
});

const CIRCLE_SIZE = Dimensions.get('window').width * 0.6;

const LoadingCircle = ({ progress }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [progress]);

  const progressCircle = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.circleContainer}>
      <View
        style={[
          styles.circle,
          {
            borderWidth: CIRCLE_SIZE * 0.05,
            width: CIRCLE_SIZE,
            height: CIRCLE_SIZE,
            borderRadius: CIRCLE_SIZE / 2,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.progressCircle,
            {
              width: CIRCLE_SIZE,
              height: CIRCLE_SIZE,
              borderRadius: CIRCLE_SIZE / 2,
              transform: [{ rotate: progressCircle }],
            },
          ]}
        />
      </View>
      <View style={styles.progressTextContainer}>
        <Text style={styles.progressPercentage}>{Math.round(progress * 100)}%</Text>
      </View>
    </View>
  );
};

const LocationScreen = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const { gender, timeframe, currentShade, targetShade, method, frequency } = route.params;

  useEffect(() => {
    getLocationAndCreatePlan();
  }, []);

  const handleRetry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setProgress(0);
    getLocationAndCreatePlan();
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  const getLocationAndCreatePlan = async () => {
    try {
      setLoading(true);
      setProgress(0.1);
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('We need location access to provide accurate tanning recommendations.');
        return;
      }

      setProgress(0.3);
      let location = await Location.getCurrentPositionAsync({});
      
      setProgress(0.5);
      // Get location name
      let address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      setProgress(0.7);
      // Get weather and UV data using OneCall API
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=127b2f84953575bc8c1ef58c64f1298b&units=metric`
      );
      const weatherData = await weatherResponse.json();

      // Validate weather data
      if (!weatherData || !weatherData.current || !weatherData.current.weather || !weatherData.current.weather[0]) {
        throw new Error('Invalid weather data format received');
      }

      const locationName = address[0]?.city || address[0]?.region || 'Unknown Location';
      
      // Extract current weather and UV data with default values
      const currentWeather = {
        temp: Math.round(weatherData.current.temp) || 25,
        conditions: weatherData.current.weather[0].main || 'Clear',
        clouds: weatherData.current.clouds || 0,
        uvi: Math.round(weatherData.current.uvi) || 5
      };

      setProgress(0.9);
      await createTanningPlan(locationName, currentWeather);
    } catch (error) {
      console.error('Location/Weather Error:', error);
      // Use default values if weather fetch fails
      const defaultWeather = {
        temp: 25,
        conditions: 'Clear',
        clouds: 0,
        uvi: 5
      };
      const locationName = 'Unknown Location';
      await createTanningPlan(locationName, defaultWeather);
    }
  };

  const createTanningPlan = async (locationName, weatherData) => {
    try {
      console.log('Creating plan with data:', {
        gender,
        currentShade,
        targetShade,
        method,
        frequency,
        timeframe,
        locationName,
        weatherData
      });

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Create a personalized tanning plan for someone with the following characteristics:
            - Gender: ${gender || 'Unknown'}
            - Current Skin Tone: ${currentShade?.name || 'Unknown'}
            - Target Skin Tone: ${targetShade?.name || 'Unknown'}
            - Tanning Method: ${method || 'Unknown'}
            - Frequency: ${frequency || 'Unknown'}
            - Timeframe: ${timeframe || 'Unknown'}
            - Location: ${locationName}
            - Current Weather: ${weatherData.conditions}, ${weatherData.temp}°C
            - Current UV Index: ${weatherData.uvi}
            
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

      const plan = {
        gender,
        currentShade,
        targetShade,
        method,
        frequency,
        timeframe,
        location: locationName,
        weather: {
          temp: weatherData.temp,
          conditions: weatherData.conditions,
          clouds: weatherData.clouds,
        },
        uvIndex: weatherData.uvi,
        recommendations: response.choices[0].message.content
      };

      console.log('Generated plan:', plan);

      setProgress(1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Navigate with the plan data
      console.log('Navigating to MainTabs with plan:', plan);
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'MainTabs',
            params: { plan }
          },
        ],
      });
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setError('Failed to generate tanning plan. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>📍</Text>
          <Text style={styles.errorTitle}>Location Access Needed</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={handleRetry}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.loadingContent}>
          <Text style={styles.loadingTitle}>Calculating your perfect routine ✨</Text>
          <Text style={styles.loadingEmojis}>🌞 ⏳ 🧴</Text>
          <LoadingCircle progress={progress} />
          <Text style={styles.loadingText}>
            {progress < 0.3 && "Getting your location..."}
            {progress >= 0.3 && progress < 0.5 && "Checking local weather..."}
            {progress >= 0.5 && progress < 0.7 && "Analyzing UV index..."}
            {progress >= 0.7 && progress < 0.9 && "Creating your personalized plan..."}
            {progress >= 0.9 && "Almost there..."}
          </Text>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  loadingEmojis: {
    fontSize: 32,
    marginBottom: 30,
    letterSpacing: 8,
  },
  circleContainer: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 30,
  },
  circle: {
    borderColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    position: 'absolute',
    borderLeftColor: '#FF6B3D',
    borderTopColor: '#FF6B3D',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderWidth: CIRCLE_SIZE * 0.05,
  },
  progressTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B3D',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B3D',
    padding: 18,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    padding: 18,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButtonText: {
    color: '#666',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LocationScreen; 