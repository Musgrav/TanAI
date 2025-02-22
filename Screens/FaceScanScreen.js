import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Dimensions, Animated, Easing } from 'react-native';
import * as ExpoCamera from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import OpenAI from 'openai';
import { EXPO_PUBLIC_OPENAI_API_KEY } from '@env';
import Svg, { Defs, Rect, Mask, Ellipse, LinearGradient, Stop, Circle, Path } from 'react-native-svg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// Debug logging
console.log('Camera module:', ExpoCamera);

const openai = new OpenAI({
  apiKey: EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for React Native
});

const OVAL_WIDTH = 260;
const OVAL_HEIGHT = 340;
const BORDER_WIDTH = 1.5;
const SQUARE_PADDING = 40; // Padding around the oval

const LoadingScreen = ({ progress }) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const loadingTexts = [
    "Analyzing skin tone...",
    "Detecting undertones...",
    "Processing features...",
    "Almost there..."
  ];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Text fade animation
    const textInterval = setInterval(() => {
      fadeAnim.setValue(0);
      setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, 2000);

    return () => clearInterval(textInterval);
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressValue = progress.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 100],
    extrapolate: 'clamp'
  });

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="loadingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0" stopColor="#FF9933" />
            <Stop offset="1" stopColor="#FF6633" />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#loadingGrad)" />
      </Svg>
      <View style={loadingStyles.content}>
        <Animated.View style={[loadingStyles.spinnerContainer, { transform: [{ rotate: spin }] }]}>
          <Svg height="160" width="160" viewBox="0 0 100 100">
            <Circle
              cx="50"
              cy="50"
              r="45"
              stroke="white"
              strokeWidth="8"
              fill="none"
              strokeDasharray="70 180"
            />
          </Svg>
        </Animated.View>
        
        <Animated.Text style={[loadingStyles.loadingText, { opacity: fadeAnim }]}>
          {loadingTexts[currentTextIndex]}
        </Animated.Text>
        
        <Animated.Text style={loadingStyles.percentageText}>
          {Math.round(progressValue.__getValue())}%
        </Animated.Text>
      </View>
    </View>
  );
};

export default function FaceScanScreen({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const progressAnimation = useRef(new Animated.Value(0)).current;

  const checkAPIAccess = async () => {
    try {
      console.log('Checking API access...');
      // First test a basic API call
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: "This is a test message. Please respond with 'API is working'."
          }
        ]
      });
      console.log('Basic API test successful:', response.choices[0].message.content);
      
      // Now test vision-specific capabilities
      const visionResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Analyze this person's skin. Focus only on: 1) Fitzpatrick scale type (I-VI), 2) Undertone (warm/cool/neutral), 3) One key characteristic. Be very concise and direct, using this format:\nType: [I-VI]\nUndertone: [warm/cool/neutral]\nKey: [characteristic]" 
              },
              {
                type: "image_url",
                image_url: {
                  "url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                }
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.3,
        store: true
      });
      console.log('Vision API test successful:', visionResponse.choices[0].message.content);
      return true;
    } catch (error) {
      console.error('API access check failed:', error);
      console.error('Error status:', error.status);
      console.error('Error response:', error.response?.data);
      Alert.alert(
        'API Access Issue',
        `Please ensure you have:\n\n1. A valid API key\n2. Access to GPT-4 Vision\n3. Sufficient credits\n\nError: ${error.message}`
      );
      return false;
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // Check camera permissions
        const { status } = await ExpoCamera.Camera.requestCameraPermissionsAsync();
        console.log('Camera permission status:', status);
        setHasPermission(status === ExpoCamera.PermissionStatus.GRANTED);
        
        // Check API access
        await checkAPIAccess();
      } catch (error) {
        console.error('Setup error:', error);
        setHasPermission(false);
      }
    })();
  }, []);

  const onCameraReady = () => {
    console.log('Camera is ready');
    setIsCameraReady(true);
  };

  const takePicture = async () => {
    if (!cameraRef.current || !isCameraReady) {
      console.log('Camera is not ready:', { ref: !!cameraRef.current, ready: isCameraReady });
      Alert.alert('Camera Error', 'Please wait for the camera to be ready and try again.');
      return;
    }

    try {
      // Check API access before taking picture
      const hasAccess = await checkAPIAccess();
      if (!hasAccess) {
        Alert.alert('API Access Required', 'Please ensure you have proper API access before proceeding.');
        return;
      }

      setIsAnalyzing(true);
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 1, // Highest quality
        exif: false,
        skipProcessing: false, // Ensure image processing is done
      });
      console.log('Photo taken successfully');
      
      if (!photo || !photo.base64) {
        throw new Error('Failed to capture image data');
      }

      setCapturedImage(photo.uri);
      
      // Add guidance for optimal photo
      Alert.alert(
        'Photo Captured',
        'Please ensure:\n\n1. Your face is well-lit\n2. You are facing the camera directly\n3. There are no strong shadows\n\nWould you like to proceed with analysis or take another photo?',
        [
          {
            text: 'Take Another',
            onPress: () => {
              setIsAnalyzing(false);
              setCapturedImage(null);
            },
            style: 'cancel',
          },
          {
            text: 'Proceed',
            onPress: () => {
              analyzeSkin(photo);
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
      setIsAnalyzing(false);
      setCapturedImage(null);
    }
  };

  const analyzeSkin = async (photo) => {
    setIsAnalyzing(true);
    
    // Start progress animation
    progressAnimation.setValue(0);
    Animated.timing(progressAnimation, {
      toValue: 100,
      duration: 3000, // Total analysis animation duration
      easing: Easing.bezier(0.23, 1, 0.32, 1),
      useNativeDriver: false,
    }).start();

    try {
      console.log('Starting skin analysis...');
      
      // Send to OpenAI for analysis
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Analyze this person's skin. Focus only on: 1) Fitzpatrick scale type (I-VI), 2) Undertone (warm/cool/neutral), 3) One key characteristic. Be very concise and direct, using this format:\nType: [I-VI]\nUndertone: [warm/cool/neutral]\nKey: [characteristic]" 
              },
              {
                type: "image_url",
                image_url: {
                  "url": `data:image/jpeg;base64,${photo.base64}`
                }
              }
            ]
          }
        ],
        max_tokens: 300,
        temperature: 0.3,
        store: true
      });

      console.log('Response received:', response);
      const analysis = response.choices[0].message.content;
      console.log('Analysis:', analysis);
      setAnalysisResult(analysis);

      // Extract skin tone information
      const skinTone = {
        name: extractSkinTone(analysis),
        analysis: analysis
      };

      // Navigate to next screen with the analysis
      navigation.navigate('DesiredShade', {
        ...route.params,
        currentShade: skinTone
      });
    } catch (error) {
      console.error('Error analyzing skin:', error);
      let errorMessage = 'Error analyzing skin. Please try again.';
      
      if (error.status === 404) {
        errorMessage = 'Error: No access to GPT-4 Vision. Please check your OpenAI API key permissions.';
      } else if (error.status === 401) {
        errorMessage = 'Error: Invalid API key. Please check your OpenAI API key.';
      } else if (error.status === 400) {
        errorMessage = 'Error: Bad request. Please try taking the photo again.';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      console.error('Detailed error:', error);
      console.error('Error status:', error.status);
      console.error('Error response:', error.response?.data);
      setAnalysisResult(errorMessage);
      Alert.alert('Error', errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractSkinTone = (analysis) => {
    // Extract the Fitzpatrick scale type from the analysis
    const fitzpatrickMatch = analysis.match(/type [I-VI]/i);
    if (fitzpatrickMatch) {
      switch (fitzpatrickMatch[0].toUpperCase()) {
        case 'TYPE I':
          return 'Very Light';
        case 'TYPE II':
          return 'Light';
        case 'TYPE III':
          return 'Medium Light';
        case 'TYPE IV':
          return 'Medium';
        case 'TYPE V':
          return 'Medium Dark';
        case 'TYPE VI':
          return 'Dark';
        default:
          return 'Medium';
      }
    }
    return 'Medium'; // Default fallback
  };

  if (hasPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }

  if (hasPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      {!capturedImage ? (
        <View style={styles.cameraContainer}>
          <ExpoCamera.CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
            onCameraReady={onCameraReady}
          />
          <View style={styles.overlayContainer}>
            <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
              <Defs>
                <Mask id="gradientMask">
                  <Rect width="100%" height="100%" fill="white" />
                  <Rect
                    x={(SCREEN_WIDTH - (OVAL_WIDTH + SQUARE_PADDING * 2)) / 2}
                    y={(SCREEN_HEIGHT - (OVAL_HEIGHT + SQUARE_PADDING * 2)) / 2}
                    width={OVAL_WIDTH + SQUARE_PADDING * 2}
                    height={OVAL_HEIGHT + SQUARE_PADDING * 2}
                    rx="20"
                    ry="20"
                    fill="black"
                  />
                </Mask>
                <Mask id="squareMask">
                  <Rect width="100%" height="100%" fill="black" />
                  <Rect
                    x={(SCREEN_WIDTH - (OVAL_WIDTH + SQUARE_PADDING * 2)) / 2}
                    y={(SCREEN_HEIGHT - (OVAL_HEIGHT + SQUARE_PADDING * 2)) / 2}
                    width={OVAL_WIDTH + SQUARE_PADDING * 2}
                    height={OVAL_HEIGHT + SQUARE_PADDING * 2}
                    rx="20"
                    ry="20"
                    fill="white"
                  />
                  <Ellipse
                    rx={OVAL_WIDTH / 2}
                    ry={OVAL_HEIGHT / 2}
                    cx={SCREEN_WIDTH / 2}
                    cy={SCREEN_HEIGHT / 2}
                    fill="black"
                  />
                </Mask>
                <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <Stop offset="0" stopColor="#FF9933" />
                  <Stop offset="1" stopColor="#FF6633" />
                </LinearGradient>
              </Defs>
              {/* Orange gradient background */}
              <Rect
                width="100%"
                height="100%"
                fill="url(#grad)"
                mask="url(#gradientMask)"
              />
              {/* White square with oval cutout */}
              <Rect
                width="100%"
                height="100%"
                fill="white"
                opacity="0.4"
                mask="url(#squareMask)"
              />
              {/* Oval borders */}
              <Ellipse
                rx={OVAL_WIDTH / 2}
                ry={OVAL_HEIGHT / 2}
                cx={SCREEN_WIDTH / 2}
                cy={SCREEN_HEIGHT / 2}
                fill="transparent"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth={BORDER_WIDTH}
              />
              <Ellipse
                rx={(OVAL_WIDTH - 10) / 2}
                ry={(OVAL_HEIGHT - 10) / 2}
                cx={SCREEN_WIDTH / 2}
                cy={SCREEN_HEIGHT / 2}
                fill="transparent"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth={BORDER_WIDTH}
              />
            </Svg>
            <View style={styles.overlay}>
              <Text style={styles.titleText}>Scan your skin</Text>
              <Text style={styles.guideText}>
                Take a selfie so our AI can analyze your skin
              </Text>
              <View style={styles.frameContainer}>
                <View style={styles.spacer} />
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={[
                    styles.button,
                    (!isCameraReady || isAnalyzing) && styles.buttonDisabled
                  ]} 
                  onPress={takePicture}
                  disabled={!isCameraReady || isAnalyzing}
                >
                  <Text style={styles.buttonText}>
                    {!isCameraReady ? 'Camera Loading...' : isAnalyzing ? 'Analyzing...' : 'Take a Selfie 📸'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.imageContainer}>
          {isAnalyzing ? (
            <LoadingScreen progress={progressAnimation} />
          ) : (
            <>
              <Image source={{ uri: capturedImage }} style={styles.camera} />
              <TouchableOpacity 
                style={[styles.button, isAnalyzing && styles.buttonDisabled]}
                onPress={() => setCapturedImage(null)}
                disabled={isAnalyzing}
              >
                <Text style={styles.text}>
                  {isAnalyzing ? 'Analyzing...' : 'Retake'}
                </Text>
              </TouchableOpacity>
              {analysisResult && (
                <Text style={styles.analysisText}>{analysisResult}</Text>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  guideText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '500',
  },
  frameContainer: {
    width: OVAL_WIDTH + SQUARE_PADDING * 2,
    height: OVAL_HEIGHT + SQUARE_PADDING * 2,
    marginVertical: 20,
  },
  spacer: {
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    width: '100%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF6633',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analysisText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    margin: 20,
  },
  text: {
    fontSize: 18,
    color: 'black',
  },
});

const loadingStyles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  spinnerContainer: {
    width: 160,
    height: 160,
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
    fontWeight: '500',
    textAlign: 'center',
  },
  percentageText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
    width: '100%',
  },
});