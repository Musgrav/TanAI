import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const PlanStep = ({ step, isCurrentStep, isCompleted }) => (
  <View style={styles.stepWrapper}>
    <View style={[
      styles.timelineConnector,
      isCompleted && styles.completedConnector,
      step.number === 1 && styles.firstConnector
    ]} />
    <View style={[
      styles.stepContainer,
      isCurrentStep && styles.currentStep,
      isCompleted && styles.completedStep
    ]}>
      <View style={[
        styles.stepDot,
        isCurrentStep && styles.currentStepDot,
        isCompleted && styles.completedStepDot
      ]}>
        {isCompleted ? (
          <Ionicons name="checkmark" size={16} color="#fff" />
        ) : (
          <Text style={styles.stepNumberText}>{step.number}</Text>
        )}
      </View>
      <View style={styles.stepContent}>
        <Text style={[
          styles.stepTitle,
          isCurrentStep && styles.currentStepTitle
        ]}>
          {step.title}
        </Text>
        <Text style={styles.stepDescription}>{step.description}</Text>
      </View>
      {isCurrentStep && (
        <View style={styles.currentStepBadge}>
          <Text style={styles.currentStepBadgeText}>Current Stage</Text>
        </View>
      )}
    </View>
  </View>
);

const PlanScreen = ({ route, navigation }) => {
  const plan = route.params?.plan || route.params?.params?.plan;
  const [currentStep, setCurrentStep] = useState(1);
  const [planSteps, setPlanSteps] = useState([]);
  const [maintenancePlan, setMaintenancePlan] = useState(null);
  const [error, setError] = useState(null);
  const [showMaintenance, setShowMaintenance] = useState(false);

  useEffect(() => {
    console.log('PlanScreen - Full route params:', route.params);
    console.log('PlanScreen - Extracted plan:', plan);

    if (!plan) {
      console.log('No plan data found in route params');
      setError('No plan data available. Please complete the onboarding process.');
      return;
    }

    if (!plan.currentShade || !plan.frequency) {
      console.log('Missing required plan data:', {
        currentShade: plan.currentShade,
        frequency: plan.frequency
      });
      setError('Incomplete plan data. Please restart the onboarding process.');
      return;
    }

    console.log('Plan data is valid, generating custom plan...');
    generateCustomPlan();
  }, [plan]);

  const generateCustomPlan = () => {
    try {
      console.log('Generating custom plan with:', {
        currentShade: plan.currentShade,
        frequency: plan.frequency,
        method: plan.method,
        timeframe: plan.timeframe
      });

      const steps = [];
      let stepNumber = 1;

      // Initial preparation steps
      steps.push({
        number: stepNumber++,
        title: 'Skin Preparation',
        description: 'Exfoliate your skin and moisturize well 24 hours before starting your tanning routine.',
        category: 'preparation'
      });

      // SPF selection based on skin type
      const spfLevel = plan.currentShade?.name?.includes('Light') ? '50+' : 
                      plan.currentShade?.name?.includes('Medium') ? '30' : '15';
      
      steps.push({
        number: stepNumber++,
        title: 'SPF Protection',
        description: `Apply SPF ${spfLevel} 30 minutes before sun exposure.`,
        category: 'protection'
      });

      // Initial exposure step
      const initialTime = plan.currentShade?.name?.includes('Light') ? '5-10' :
                         plan.currentShade?.name?.includes('Medium') ? '10-15' : '15-20';
      steps.push({
        number: stepNumber++,
        title: 'Initial Exposure',
        description: `Start with ${initialTime} minutes of sun exposure during optimal UV hours (10 AM - 4 PM).`,
        category: 'exposure'
      });

      // Gradual increase steps
      const increaseTime = plan.currentShade?.name?.includes('Light') ? '2-3' :
                          plan.currentShade?.name?.includes('Medium') ? '3-5' : '5-7';
      steps.push({
        number: stepNumber++,
        title: 'Gradual Increase',
        description: `Increase exposure time by ${increaseTime} minutes every other session.`,
        category: 'progression'
      });

      // Frequency based steps
      const frequency = plan.frequency === 'Daily' ? 'daily' :
                       plan.frequency === 'Weekly' ? '2-3 times per week' : 'once per week';
      steps.push({
        number: stepNumber++,
        title: 'Regular Sessions',
        description: `Maintain ${frequency} tanning sessions at your target duration.`,
        category: 'routine'
      });

      // Progress check
      steps.push({
        number: stepNumber++,
        title: 'Progress Assessment',
        description: 'Take progress photos every week to track your tanning journey.',
        category: 'tracking'
      });

      console.log('Generated Steps:', steps);
      setPlanSteps(steps);

      // Generate maintenance plan
      const maintenance = {
        frequency: plan.frequency === 'Daily' ? '2-3 times per week' :
                     plan.frequency === 'Weekly' ? 'once per week' : 'every other week',
        duration: plan.currentShade?.name?.includes('Light') ? '15-20' :
                  plan.currentShade?.name?.includes('Medium') ? '20-25' : '25-30',
        spf: plan.currentShade?.name?.includes('Light') ? '30+' :
             plan.currentShade?.name?.includes('Medium') ? '15-30' : '15',
        tips: [
          'Maintain regular moisturizing routine',
          'Continue using appropriate SPF protection',
          'Stay hydrated before and after sessions',
          'Monitor skin health regularly'
        ]
      };
      setMaintenancePlan(maintenance);
    } catch (err) {
      console.error('Error generating plan:', err);
      setError('Error generating your plan. Please try again.');
    }
  };

  const handleNextStep = () => {
    if (currentStep < planSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowMaintenance(true);
    }
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.navigate('Gender')}
          >
            <Text style={styles.retryButtonText}>Restart Onboarding</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!planSteps.length) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Generating your custom plan...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FF6B3D', '#FFB03D']}
        style={styles.header}
      >
        <Text style={styles.title}>Your Tanning Journey</Text>
        <Text style={styles.subtitle}>Follow your personalized roadmap to achieve your desired tan</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.timeline}>
          {planSteps.map((step) => (
            <PlanStep
              key={step.number}
              step={step}
              isCurrentStep={step.number === currentStep}
              isCompleted={step.number < currentStep}
            />
          ))}
        </View>

        {showMaintenance && maintenancePlan && (
          <View style={styles.maintenanceContainer}>
            <Text style={styles.maintenanceTitle}>🎉 Maintenance Plan</Text>
            <Text style={styles.maintenanceSubtitle}>
              Congratulations! You've reached your tanning goal. Follow this maintenance plan to keep your perfect tan.
            </Text>
            <View style={styles.maintenanceCard}>
              <View style={styles.maintenanceItem}>
                <Text style={styles.maintenanceLabel}>Frequency</Text>
                <Text style={styles.maintenanceValue}>{maintenancePlan.frequency}</Text>
              </View>
              <View style={styles.maintenanceDivider} />
              <View style={styles.maintenanceItem}>
                <Text style={styles.maintenanceLabel}>Duration</Text>
                <Text style={styles.maintenanceValue}>{maintenancePlan.duration} minutes</Text>
              </View>
              <View style={styles.maintenanceDivider} />
              <View style={styles.maintenanceItem}>
                <Text style={styles.maintenanceLabel}>SPF Level</Text>
                <Text style={styles.maintenanceValue}>SPF {maintenancePlan.spf}</Text>
              </View>
            </View>

            <View style={styles.tipsCard}>
              <Text style={styles.tipsTitle}>Pro Tips</Text>
              {maintenancePlan.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
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
    paddingBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
  },
  content: {
    flex: 1,
  },
  timeline: {
    padding: 20,
    paddingTop: 10,
  },
  stepWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  timelineConnector: {
    position: 'absolute',
    left: 15,
    top: 30,
    bottom: -20,
    width: 2,
    backgroundColor: '#E0E0E0',
  },
  completedConnector: {
    backgroundColor: '#4CAF50',
  },
  firstConnector: {
    top: 0,
  },
  stepContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentStep: {
    borderColor: '#FF6B3D',
    borderWidth: 2,
    backgroundColor: '#FFF9F6',
  },
  completedStep: {
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B3D',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  currentStepDot: {
    backgroundColor: '#FF6B3D',
    transform: [{ scale: 1.1 }],
  },
  completedStepDot: {
    backgroundColor: '#4CAF50',
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  currentStepTitle: {
    color: '#FF6B3D',
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  currentStepBadge: {
    position: 'absolute',
    top: -12,
    right: 15,
    backgroundColor: '#FF6B3D',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentStepBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  maintenanceContainer: {
    padding: 20,
    paddingTop: 0,
  },
  maintenanceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  maintenanceSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    lineHeight: 22,
  },
  maintenanceCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  maintenanceItem: {
    flex: 1,
    alignItems: 'center',
  },
  maintenanceDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 15,
  },
  maintenanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  maintenanceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  tipsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#FF6B3D',
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B3D',
    fontSize: 18,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF6B3D',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PlanScreen; 