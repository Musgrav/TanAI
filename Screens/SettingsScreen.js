import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SettingItem = ({ icon, title, subtitle, onPress, value, type = 'arrow' }) => (
  <TouchableOpacity style={styles.settingItem} onPress={onPress}>
    <View style={[styles.settingIcon, { backgroundColor: '#FFF2E9' }]}>
      <Ionicons name={icon} size={24} color="#FF6B3D" />
    </View>
    <View style={styles.settingInfo}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {type === 'arrow' && <Ionicons name="chevron-forward" size={24} color="#666" />}
    {type === 'switch' && <Switch value={value} onValueChange={onPress} />}
  </TouchableOpacity>
);

const SettingsScreen = ({ navigation, route }) => {
  const [notifications, setNotifications] = useState(true);
  const [progressTracking, setProgressTracking] = useState(true);
  const [aiRecommendations, setAiRecommendations] = useState(true);

  const plan = route.params?.plan;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tanning Goals Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tanning Goals</Text>
          <SettingItem
            icon="sunny"
            title="Update Tanning Plan"
            subtitle="Change your goals and preferences"
            onPress={() => navigation.navigate('TanningGoal', {
              gender: plan?.gender || 'Unknown',
              currentShade: plan?.currentShade,
              targetShade: plan?.targetShade,
              method: plan?.method,
              frequency: plan?.frequency,
              timeframe: plan?.timeframe,
              isEditing: true
            })}
          />
          <SettingItem
            icon="calendar"
            title="Session Schedule"
            subtitle="Adjust your tanning frequency"
            onPress={() => {}}
          />
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingItem
            icon="notifications"
            title="Push Notifications"
            subtitle="Reminders for tanning sessions"
            type="switch"
            value={notifications}
            onPress={() => setNotifications(!notifications)}
          />
          <SettingItem
            icon="time"
            title="Reminder Times"
            subtitle="Set your preferred notification times"
            onPress={() => {}}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem
            icon="analytics"
            title="Progress Tracking"
            subtitle="Track your tanning journey"
            type="switch"
            value={progressTracking}
            onPress={() => setProgressTracking(!progressTracking)}
          />
          <SettingItem
            icon="bulb"
            title="AI Recommendations"
            subtitle="Personalized tanning advice"
            type="switch"
            value={aiRecommendations}
            onPress={() => setAiRecommendations(!aiRecommendations)}
          />
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem
            icon="person"
            title="Profile Settings"
            subtitle="Update your personal information"
            onPress={() => {}}
          />
          <SettingItem
            icon="shield-checkmark"
            title="Privacy Settings"
            subtitle="Manage your data and privacy"
            onPress={() => {}}
          />
        </View>

        {/* Help Section */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Help & Support</Text>
          <SettingItem
            icon="help-circle"
            title="FAQ"
            subtitle="Frequently asked questions"
            onPress={() => {}}
          />
          <SettingItem
            icon="mail"
            title="Contact Support"
            subtitle="Get help with TanAI"
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Add padding to account for tab bar
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  lastSection: {
    paddingBottom: 20, // Add extra padding to last section
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default SettingsScreen; 