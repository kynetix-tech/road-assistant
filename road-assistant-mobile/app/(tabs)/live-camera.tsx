import ThemedButton from '@/components/ThemedButton';
import { getImageByClass } from '@/constants/image.paths';
import { loadModel, prepareSingleImageArr } from '@/lib/model-utils';
import * as tf from '@tensorflow/tfjs';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';

export default function RealTimeRecognitionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState<Location.LocationObject>();
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionData, setRecognitionData] = useState<any[]>([]);
  const [currentClass, setCurrentClass] = useState<number>();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    (async () => {
      if (!locationPermission) {
        const { status } = await requestLocationPermission();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required to use this feature.');
        } else {
          Location.watchPositionAsync({ accuracy: Location.Accuracy.High }, setLocation);
        }
      }
    })();
  }, []);

  const handleStartTrip = () => {
    setIsRecording(true);
    return async () => {
      const model = await loadModel();
      const interval = setInterval(async () => {
        if (cameraRef.current) {
          const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true });
          const preparedImage = await prepareSingleImageArr(photo?.uri || '');
          const prediction = model.predict(preparedImage) as tf.Tensor;
          const predictionData = await prediction.data();
  
          const detectedClass = predictionData.indexOf(Math.max(...predictionData));
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
          setCurrentClass(detectedClass);
          
          if (location) {
            setRecognitionData((prev) => [
              ...prev,
              {
                time: new Date().toISOString(),
                class: detectedClass,
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
            ]);
          }
        }
      }, 2000);
  
      return () => clearInterval(interval);
    };
  } 

  const handleEndTrip = async () => {
    setIsRecording(false);
    sendDataToBackend(recognitionData);
    setRecognitionData([]);
    const currentLocation = await Location.getCurrentPositionAsync({});
    console.log(currentLocation)
  };

  const sendDataToBackend = async (data: any) => {
    return;
    await fetch('https://your-backend-api.com/recognition-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back">
        <View style={styles.overlay}>
          {currentClass === undefined ? 
          <></> : 
          <Image source={getImageByClass(currentClass)} style={styles.image} resizeMode="contain" />}
        </View>
      </CameraView>
      <View style={styles.buttonContainer}>
        {
          !isRecording ? (
            <ThemedButton onPress={handleStartTrip} title={'Розпочати поїздку'} />
          ) : (
            <ThemedButton onPress={handleEndTrip} title={'Закінчити поїздку'} />
          )
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    width: '90%',
    height: 400,
    marginTop: 20,
    alignSelf: 'center',
  },
  overlay: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: 20,
    alignItems: 'center'
  },
});
