import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
  ActivityIndicator,
  Share,
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const OPENWEATHER_API_KEY = '127b2f84953575bc8c1ef58c64f1298b'; // Replace with your OpenWeather API key

const StatCard = ({ emoji, title, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.emoji}>{emoji}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const getWeatherEmoji = (conditions, uvi) => {
  if (conditions.toLowerCase().includes('rain')) return '🌧️';
  if (conditions.toLowerCase().includes('cloud')) return '⛅';
  if (uvi >= 8) return '☀️';
  if (uvi >= 5) return '🌤️';
  return '☀️';
};

const formatTimeDisplay = (hour) => {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}${ampm}`;
};

const TimeSlot = ({ time, displayTime, isSelected, onPress }) => (
  <TouchableOpacity 
    style={[styles.timeSlot, isSelected && styles.selectedTimeSlot]}
    onPress={onPress}
  >
    <Text style={[styles.timeText, isSelected && styles.selectedTimeText]}>
      {displayTime}
    </Text>
    <Text style={[styles.timeEmoji, isSelected && styles.selectedTimeEmoji]}>
      {isSelected ? '☀️' : '🌤️'}
    </Text>
  </TouchableOpacity>
);

const ChecklistItem = ({ title, emoji, isCompleted, onToggle }) => (
  <TouchableOpacity 
    style={[styles.checklistItem, isCompleted && styles.checklistItemCompleted]}
    onPress={onToggle}
  >
    <Text style={styles.checklistEmoji}>{emoji}</Text>
    <Text style={styles.checklistText}>{title}</Text>
    <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
      {isCompleted && <Ionicons name="checkmark" size={16} color="#fff" />}
    </View>
  </TouchableOpacity>
);

const HomeScreen = ({ route, navigation }) => {
  const plan = route.params?.plan;
  const [selectedTime, setSelectedTime] = useState('1PM');
  const [timeLeft, setTimeLeft] = useState(0);
  const [uvIndex, setUvIndex] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('Loading...');
  const [errorMsg, setErrorMsg] = useState(null);
  const [hourlyForecast, setHourlyForecast] = useState([]);
  const [checklist, setChecklist] = useState([
    { id: 1, title: 'Apply Sunscreen', emoji: '🧴', completed: false },
    { id: 2, title: 'Stay Hydrated', emoji: '💧', completed: false },
    { id: 3, title: 'Take Breaks', emoji: '⏰', completed: false },
  ]);
  const [streakDays, setStreakDays] = useState(0);
  
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        let address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });

        const locationName = address[0]?.city || address[0]?.region || 'Unknown Location';
        setLocationName(locationName);
        
        await fetchWeatherAndUV(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        setErrorMsg('Error getting location or weather data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fetchWeatherAndUV = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      
      console.log('Weather API Response:', data);

      if (!data || !data.daily || !data.hourly) {
        throw new Error('Invalid weather data format received');
      }

      // Get tomorrow's date at 6 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(6, 0, 0, 0);

      // Get the timestamp for tomorrow at 6 AM
      const tomorrowTimestamp = Math.floor(tomorrow.getTime() / 1000);

      // Filter hourly forecast to show only tomorrow's daylight hours (6 AM to 6 PM)
      const dayLightHours = data.hourly.filter(hour => {
        const hourDate = new Date(hour.dt * 1000);
        return hourDate.getTime() >= tomorrow.getTime() && 
               hourDate.getHours() >= 6 && 
               hourDate.getHours() <= 18;
      });

      // Process the daylight hours forecast
      const processedForecast = dayLightHours.map(hour => {
        const hourDate = new Date(hour.dt * 1000);
        const hourNum = hourDate.getHours();
        return {
          time: `${hourNum}:00`,
          displayTime: formatTimeDisplay(hourNum),
          temp: Math.round(hour.temp),
          uvi: Math.round(hour.uvi),
          conditions: hour.weather[0].main
        };
      });

      console.log('Processed Forecast:', processedForecast);

      setHourlyForecast(processedForecast);
      
      // Set initial UV index from the first daylight hour
      if (processedForecast.length > 0) {
        const initialForecast = processedForecast[0];
        setUvIndex(initialForecast.uvi);
        setSelectedTime(initialForecast.time);
        setWeather({
          temp: initialForecast.temp,
          clouds: data.current.clouds || 0,
          conditions: initialForecast.conditions,
          location: locationName
        });
      } else {
        // Fallback to tomorrow's max UV from daily forecast
        const tomorrow = data.daily[1];
        setUvIndex(Math.round(tomorrow.uvi));
        setWeather({
          temp: Math.round(tomorrow.temp.day),
          clouds: tomorrow.clouds || 0,
          conditions: tomorrow.weather[0].main,
          location: locationName
        });
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setLocationName('Sydney, Australia');
      setUvIndex(5);
      setWeather({
        temp: 25,
        clouds: 0,
        conditions: 'Clear',
        location: 'Sydney, Australia'
      });
    }
  };

  // Update UV index when time slot is selected
  const handleTimeSelection = (time) => {
    setSelectedTime(time);
    const selectedForecast = hourlyForecast.find(hour => hour.time === time);
    if (selectedForecast) {
      setUvIndex(selectedForecast.uvi);
      setWeather(prev => ({
        ...prev,
        temp: selectedForecast.temp,
        conditions: selectedForecast.conditions
      }));
    }
  };

  const getRecommendedTime = () => {
    if (!plan || !plan.currentShade || !plan.currentShade.name || !uvIndex) return 0;
    
    // Base time based on skin type
    const baseTime = plan.currentShade.name.includes('Light') ? 10 :
                    plan.currentShade.name.includes('Medium') ? 15 : 20;
    
    // Adjust for UV index
    if (uvIndex >= 11) return 0; // Too dangerous to tan
    if (uvIndex >= 8) return Math.max(5, baseTime - 10);
    if (uvIndex >= 6) return Math.max(8, baseTime - 5);
    if (uvIndex <= 2) return Math.min(30, baseTime + 10); // Low UV, can stay longer
    
    // Adjust for weather conditions
    if (weather) {
      if (weather.clouds > 70) return Math.min(30, baseTime + 5); // Cloudy
      if (weather.conditions === 'Rain') return 0; // Raining
    }
    
    return baseTime;
  };

  const getUVWarning = () => {
    if (!uvIndex) return '';
    if (uvIndex >= 11) return '⚠️ Extreme UV - Not safe to tan';
    if (uvIndex >= 8) return '⚠️ Very high UV - Limited exposure recommended';
    if (uvIndex >= 6) return '⚡ High UV - Moderate exposure';
    if (uvIndex <= 2) return '📝 Low UV - Extended exposure possible';
    return '☀️ Moderate UV - Good conditions';
  };

  const startTanning = () => {
    const minutes = getRecommendedTime();
    if (minutes === 0) {
      Alert.alert('Not Safe', 'Current conditions are not suitable for tanning. Please try again later when UV levels are more favorable.');
      return;
    }
    setTimeLeft(minutes * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleChecklistItem = (id) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const shareProgress = async () => {
    try {
      const goalName = plan && plan.desiredShade && plan.desiredShade.name 
        ? plan.desiredShade.name 
        : 'Custom tan';
      const completedTasks = checklist.filter(item => item.completed).length;
      
      const message = [
        '🌞 My Tanning Journey with TanAI 🌞',
        '',
        'Current Streak: ' + streakDays + ' days',
        'Goal: ' + goalName,
        'Today\'s Progress: ' + completedTasks + '/' + checklist.length + ' tasks completed!',
        '',
        '#TanAI #TanningJourney #HealthyTanning'
      ].join('\n');
      
      await Share.share({
        message,
        title: 'My Tanning Progress'
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share progress');
    }
  };

  const getTipOfTheDay = () => {
    const tips = [
      '🌞 Reapply sunscreen every 2 hours for an even tan.',
      '💧 Stay hydrated! Drink water before, during, and after tanning.',
      '⏰ Start with short sessions and gradually increase duration.',
      '🧴 Don\'t forget to moisturize after tanning!',
      '👕 Rotate your position to ensure even exposure.'
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  if (!plan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>👋</Text>
          <Text style={styles.welcomeTitle}>Welcome to TanAI</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('TanningGoal')}
          >
            <Text style={styles.startButtonText}>Create Your Plan</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B3D" />
          <Text style={styles.loadingText}>Getting location and weather data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (errorMsg) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.errorText}>{errorMsg}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => navigation.replace('Home', { plan })}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Convert timeframe to days for display
  const getDays = (timeframe) => {
    if (!timeframe) return '0';
    if (timeframe === 'Ongoing maintenance') return '∞';
    const weeks = timeframe.includes('week') ? parseInt(timeframe) : 0;
    const months = timeframe.includes('month') ? parseInt(timeframe) * 30 : 0;
    return (weeks * 7 + months * 30).toString();
  };

  // Get session duration based on skin tone
  const getSessionDuration = (currentShade) => {
    if (!currentShade || !currentShade.name) return '0';
    if (currentShade.name.includes('Light')) return '10';
    if (currentShade.name.includes('Medium')) return '15';
    return '20';
  };

  // Get SPF recommendation based on current shade
  const getSPF = (currentShade) => {
    if (!currentShade || !currentShade.name) return '0';
    if (currentShade.name.includes('Light')) return '50+';
    if (currentShade.name.includes('Medium')) return '30';
    return '15';
  };

  // Get sessions per week
  const getSessionsPerWeek = (frequency) => {
    if (!frequency) return '0';
    if (frequency === 'Daily') return '7';
    if (frequency === 'Weekly') return '2-3';
    return '1';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FF6B3D', '#FFB03D']}
        style={styles.gradientBackground}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text style={styles.location}>{locationName}, Today</Text>
            
            {/* Time Slots */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.timelineScroll}
            >
              {hourlyForecast.map((hour, index) => (
                <TimeSlot
                  key={`timeslot-${index}-${hour.time}`}
                  time={hour.time}
                  displayTime={hour.displayTime}
                  isSelected={hour.time === selectedTime}
                  onPress={() => handleTimeSelection(hour.time)}
                />
              ))}
            </ScrollView>

            {/* UV Index */}
            <View style={styles.uvContainer}>
              <Text style={styles.uvLabel}>UV INDEX</Text>
              <Text style={styles.uvValue}>{uvIndex}</Text>
              <Text style={styles.uvDescription}>
                {getUVWarning()}
              </Text>
            </View>

            {/* Recommendations */}
            <View style={styles.recommendationsContainer}>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationEmoji}>🧴</Text>
                <Text style={styles.recommendationLabel}>SPF {getSPF(plan && plan.currentShade)}</Text>
              </View>
              <View style={styles.recommendationDivider} />
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationEmoji}>⏰</Text>
                <Text style={styles.recommendationLabel}>NOW</Text>
              </View>
            </View>

            {/* Tanning Time */}
            <View style={styles.tanningTimeContainer}>
              <Text style={styles.tanningTimeLabel}>Tanning time: {getRecommendedTime()} mins</Text>
              <Text style={styles.tanningTimeDescription}>
                The time you need to get to next shade in this UV
              </Text>
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.content}>
            {/* Daily Checklist */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Daily Checklist</Text>
              {checklist.map(item => (
                <ChecklistItem
                  key={item.id}
                  title={item.title}
                  emoji={item.emoji}
                  isCompleted={item.completed}
                  onToggle={() => toggleChecklistItem(item.id)}
                />
              ))}
            </View>

            {/* Progress Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Progress</Text>
              <View style={styles.progressCard}>
                <View style={styles.streakContainer}>
                  <Text style={styles.streakNumber}>{streakDays}</Text>
                  <Text style={styles.streakLabel}>Day Streak</Text>
                </View>
                <View style={styles.progressBar}>
                  <Animated.View style={[styles.progressFill, { width: `${(streakDays / 30) * 100}%` }]} />
                </View>
                <Text style={styles.progressText}>{30 - streakDays} days to goal</Text>
              </View>
            </View>

            {/* Tip of the Day */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AI Tip of the Day</Text>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>{getTipOfTheDay()}</Text>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity style={styles.startButton} onPress={startTanning}>
              <Text style={styles.buttonEmoji}>🌞</Text>
              <Text style={styles.startButtonText}>Start Today's Routine</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareButton} onPress={shareProgress}>
              <Text style={styles.buttonEmoji}>📸</Text>
              <Text style={styles.shareButtonText}>Share My Progress</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FF6B3D', // Match gradient start color
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingBottom: 100, // Add padding to account for tab bar
  },
  header: {
    padding: 20,
  },
  location: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  timelineScroll: {
    marginBottom: 30,
  },
  timeSlot: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 70,
  },
  selectedTimeSlot: {
    backgroundColor: '#fff',
  },
  timeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedTimeText: {
    color: '#FF6B3D',
  },
  timeEmoji: {
    fontSize: 20,
    opacity: 0.8,
  },
  selectedTimeEmoji: {
    opacity: 1,
  },
  uvContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  uvLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  uvValue: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  uvDescription: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  recommendationsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  recommendationItem: {
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  recommendationDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  recommendationEmoji: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 4,
  },
  recommendationLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  tanningTimeContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
  },
  tanningTimeLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  tanningTimeDescription: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 120, // Increase bottom padding to prevent content from being hidden behind tab bar
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  streakContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B3D',
  },
  streakLabel: {
    fontSize: 14,
    color: '#666',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B3D',
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B3D',
    padding: 20,
    borderRadius: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FF6B3D',
  },
  shareButtonText: {
    color: '#FF6B3D',
    fontSize: 18,
    fontWeight: '600',
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  checklistItemCompleted: {
    opacity: 0.8,
  },
  checklistEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  checklistText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B3D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF6B3D',
  },
  emoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginTop: 20,
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B3D',
    padding: 15,
    borderRadius: 25,
    width: 200,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen; 