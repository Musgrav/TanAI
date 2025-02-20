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

  useEffect(() => {
    (async () => {
      try {
        const { status } = await ExpoCamera.Camera.requestCameraPermissionsAsync();
        console.log('Camera permission status:', status);
        setHasPermission(status === ExpoCamera.PermissionStatus.GRANTED);
      } catch (error) {
        console.error('Permission error:', error);
        setHasPermission(false);
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.7,
          exif: false,
        });
        console.log('Photo taken successfully');
        setCapturedImage(photo.uri);
        analyzeSkin(photo);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const analyzeSkin = async (photo) => {
    setIsAnalyzing(true);
    try {
      console.log('Starting skin analysis...');
      
      // Send to OpenAI for analysis
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this person's skin tone and characteristics. Provide: 1) Current skin tone on Fitzpatrick scale, 2) Undertone, 3) Key characteristics. Keep it concise."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${photo.base64}`,
                  detail: "low"
                }
              }
            ]
          }
        ],
        max_tokens: 150,
        temperature: 0.7
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
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      console.error('Detailed error:', error);
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
          >
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, isAnalyzing && styles.buttonDisabled]} 
                onPress={takePicture}
                disabled={isAnalyzing}
              >
                <Text style={styles.text}>
                  {isAnalyzing ? 'Analyzing...' : 'Take Picture'}
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
});