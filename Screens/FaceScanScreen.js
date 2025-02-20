import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import * as ExpoCamera from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import OpenAI from 'openai';
import { EXPO_PUBLIC_OPENAI_API_KEY } from '@env';

// Debug logging
console.log('Camera module:', ExpoCamera);

const openai = new OpenAI({
  apiKey: EXPO_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for React Native
});

export default function FaceScanScreen({ navigation, route }) {
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

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
              { type: "text", text: "This is a test message. Respond with 'Vision API is working'." },
              {
                type: "image_url",
                image_url: {
                  "url": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                }
              }
            ]
          }
        ],
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
    try {
      console.log('Starting skin analysis...');
      
      // Send to OpenAI for analysis
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this person's skin tone and characteristics. Provide: 1) Current skin tone on Fitzpatrick scale, 2) Undertone, 3) Key characteristics. Keep it concise." },
              {
                type: "image_url",
                image_url: {
                  "url": `data:image/jpeg;base64,${photo.base64}`
                }
              }
            ]
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
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
          >
            <View style={styles.overlay}>
              <Text style={styles.guideText}>
                {isCameraReady ? 'Position your face in good lighting' : 'Preparing camera...'}
              </Text>
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
                <Text style={styles.text}>
                  {!isCameraReady ? 'Camera Loading...' : isAnalyzing ? 'Analyzing...' : 'Take Picture'}
                </Text>
              </TouchableOpacity>
            </View>
          </ExpoCamera.CameraView>
        </View>
      ) : (
        <View style={styles.imageContainer}>
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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  button: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  text: {
    fontSize: 18,
    color: 'black',
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
  overlay: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
  },
  guideText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});