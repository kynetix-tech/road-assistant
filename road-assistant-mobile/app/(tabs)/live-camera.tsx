import UnauthorizedScreen from '@/components/NotAuthorized';
import ThemedButton from '@/components/ThemedButton';
import { EARTH_RADIUS, LOCATION_TRESHOLD, MODEL_TRESHOLD } from '@/constants/common';
import { getImageByClass } from '@/constants/image.paths';
import { loadModel, prepareSingleImageArr } from '@/lib/model-utils';
import { CommentRequest, RouteReportRequest, RouteService, SignItem } from '@/service/Api';
import * as tf from '@tensorflow/tfjs';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Image, StyleSheet, Text, View } from 'react-native';
import { useAuth0 } from 'react-native-auth0';
import Dialog from 'react-native-dialog';

export interface AccelGyroData {
  x: number;
  y: number;
  z: number;
}

export default function RealTimeRecognitionScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [location, setLocation] = useState<Location.LocationObject>();
  const [startLocation, setStartLocation] = useState<Location.LocationObject>();
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionData, setRecognitionData] = useState<SignItem[]>([]);
  const [currentClass, setCurrentClass] = useState<number>();
  const [comments, setComments] = useState<CommentRequest[]>([]);
  const cameraRef = useRef<CameraView>(null);
  const { user } = useAuth0();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  const [accelData, setAccelData] = useState<AccelGyroData>({ x: 0, y: 0, z: 0 });
  const [gyroData, setGyroData] = useState<AccelGyroData>({ x: 0, y: 0, z: 0 });
  const [movementDescription, setMovementDescription] = useState("Спокійний рух");

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

  const handleAddComment = async () => {
    const currentLocation = await Location.getCurrentPositionAsync({});
    setComments(prev => [
      ...prev,
      {
        text: commentText,
        coordinates: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude
        }
      } as any
    ]);
    setCommentText("");
    setDialogVisible(false);
  };

  const handleStartTrip = () => {
    setIsRecording(true);
    setStartLocation(location);
    let lastDetectedClass: number;
    let lastDetectedLocation: Location.LocationObjectCoords;
  
    return async () => {
      const model = await loadModel();
      const interval = setInterval(async () => {
        if (cameraRef.current) {
          const photo = await cameraRef.current.takePictureAsync({ skipProcessing: true });
          const preparedImage = await prepareSingleImageArr(photo?.uri || '');
          const prediction = model.predict(preparedImage) as tf.Tensor;
          const predictionData = await prediction.data();
  
          const maxProbability = Math.max(...predictionData);
          const detectedClass = predictionData.indexOf(maxProbability);
  
          // Поріг достовірності
          if (maxProbability > MODEL_TRESHOLD) {
            const currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation);
            setCurrentClass(detectedClass);
  
            const isSameClass = lastDetectedClass === detectedClass;
            const isNearby = lastDetectedLocation
              ? getDistance(
                  lastDetectedLocation,
                  currentLocation.coords
                ) < LOCATION_TRESHOLD
              : false;
  
            if (!(isSameClass && isNearby)) {
              setRecognitionData((prev) => [
                ...prev,
                {
                  signClass: detectedClass.toString(),
                  coordinates: {
                    latitude: currentLocation.coords.latitude,
                    longitude: currentLocation.coords.longitude,
                  }
                }
              ]);
  
              lastDetectedClass = detectedClass;
              lastDetectedLocation = currentLocation.coords;
            }
          }
        }
      }, 500);
  
      return () => clearInterval(interval);
    };
  };
  
  const getDistance = (
    coords1: Location.LocationObjectCoords, 
    coords2: Location.LocationObjectCoords
  ) => {
    const lat1 = coords1.latitude * (Math.PI / 180);
    const lat2 = coords2.latitude * (Math.PI / 180);
    const deltaLat = (coords2.latitude - coords1.latitude) * (Math.PI / 180);
    const deltaLon = (coords2.longitude - coords1.longitude) * (Math.PI / 180);
  
    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return EARTH_RADIUS * c;
  };
  

  const handleEndTrip = async () => {
    setIsRecording(false);
    const uploadData = {
      startPoint: {
        latitude: startLocation?.coords.latitude || 0,
        longitude: startLocation?.coords.longitude || 0,
      },
      endPoint: {
        latitude: location?.coords.latitude || 0,
        longitude: location?.coords.longitude || 0,
      },
      recognizedSigns: recognitionData,
      comments
    }

    sendDataToBackend(uploadData);
    setRecognitionData([]);

    const currentLocation = await Location.getCurrentPositionAsync({});
    console.log(currentLocation)
  };

  const sendDataToBackend = (data: RouteReportRequest) => async () => {
    await RouteService.addNewReport(data);
  };

  useEffect(() => {
    const accelSubscription = Accelerometer.addListener(data => {
      setAccelData(data);
      detectHarshManeuver(data, gyroData);
    });
    const gyroSubscription = Gyroscope.addListener(data => {
      setGyroData(data);
      detectHarshManeuver(accelData, data);
    });

    Accelerometer.setUpdateInterval(100); // 100 ms
    Gyroscope.setUpdateInterval(100); // 100 ms

    return () => {
      accelSubscription.remove();
      gyroSubscription.remove();
    };
  }, [accelData, gyroData]);

  // Функція для визначення різких маневрів
  function detectHarshManeuver(accel: AccelGyroData, gyro: AccelGyroData) {
    const accelMagnitude = Math.sqrt(accel.x ** 2 + accel.y ** 2 + accel.z ** 2);
    const gyroMagnitude = Math.sqrt(gyro.x ** 2 + gyro.y ** 2 + gyro.z ** 2);

    const ACCEL_THRESHOLD = 2.3; // 2.3g
    const GYRO_THRESHOLD = 5.5;

    if (accelMagnitude > ACCEL_THRESHOLD) {
      setMovementDescription("Різке прискорення або гальмування");
      setTimeout(() => setMovementDescription("Спокійний рух"), 2000)
    } else if (gyroMagnitude > GYRO_THRESHOLD) {
      setMovementDescription("Різкий поворот");
      setTimeout(() => setMovementDescription("Спокійний рух"), 2000)
    }
  }

  if(!user) {
    return <UnauthorizedScreen />
  }

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
          <Image source={require('@/assets/images/empty.png')}/> : 
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
      <View style={styles.monitorContainer}>
        <Text style={styles.text}>Статус: {movementDescription}</Text>
        <Text>Акселерометр - x: {accelData.x.toFixed(2)} y: {accelData.y.toFixed(2)} z: {accelData.z.toFixed(2)}</Text>
        <Text>Гіроскоп - x: {gyroData.x.toFixed(2)} y: {gyroData.y.toFixed(2)} z: {gyroData.z.toFixed(2)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <ThemedButton onPress={() => isRecording ? setDialogVisible(true) : setDialogVisible(false)} title={'Додати нотатку'} />
      </View>
      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Додати нотатку</Dialog.Title>
        <Dialog.Input
          label="Що би ви хотіли занотувати за даною локацією?"
          placeholder="Введіть текст..."
          value={commentText}
          onChangeText={setCommentText}
        />
        <Dialog.Button label="Скасувати" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="Додати" onPress={handleAddComment} />
      </Dialog.Container>
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
    aspectRatio: 3 / 4,
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
    alignItems: 'center'
  },
  monitorContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  }
});
