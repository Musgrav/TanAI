import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import GenderScreen from './Screens/GenderScreen';
import TanningGoalScreen from './Screens/TanningGoalScreen';
import TimelineScreen from './Screens/TimelineScreen';
import DesiredShadeScreen from './Screens/DesiredShadeScreen';
import TanningMethodScreen from './Screens/TanningMethodScreen';
import TanningFrequencyScreen from './Screens/TanningFrequencyScreen';
import LocationScreen from './Screens/LocationScreen';
import HomeScreen from './Screens/HomeScreen';
import ProgressScreen from './Screens/ProgressScreen';
import ShareScreen from './Screens/ShareScreen';
import SettingsScreen from './Screens/SettingsScreen';
import PlanScreen from './Screens/PlanScreen';
import FaceScanScreen from './Screens/FaceScanScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = ({ route }) => {
  // Extract plan from nested params structure
  const plan = route.params?.params?.plan || route.params?.plan;
  console.log('MainTabs - Full route params:', route.params);
  console.log('MainTabs - Extracted plan:', plan);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Plan') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B3D',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 85,
          paddingTop: 5,
          paddingBottom: 30,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: 'rgba(0,0,0,0.1)',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          paddingBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        initialParams={{ plan }}
        listeners={{
          tabPress: e => {
            console.log('Home Tab Pressed - Plan Data:', plan);
          },
        }}
      />
      <Tab.Screen 
        name="Plan" 
        component={PlanScreen}
        initialParams={{ plan }}
        listeners={{
          tabPress: e => {
            console.log('Plan Tab Pressed - Full Plan Data:', plan);
          },
        }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        initialParams={{ plan }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        initialParams={{ plan }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Gender"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Gender" component={GenderScreen} />
          <Stack.Screen name="TanningGoal" component={TanningGoalScreen} />
          <Stack.Screen name="Timeline" component={TimelineScreen} />
          <Stack.Screen name="FaceScan" component={FaceScanScreen} />
          <Stack.Screen name="DesiredShade" component={DesiredShadeScreen} />
          <Stack.Screen name="TanningMethod" component={TanningMethodScreen} />
          <Stack.Screen name="TanningFrequency" component={TanningFrequencyScreen} />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}