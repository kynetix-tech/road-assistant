import { getPresetForResult } from '@/assets/presets/preset.rs';
import ThemedButton from '@/components/ThemedButton';
import { getImageByClass, ResultItem } from '@/constants/image.paths';
import { loadModel, prepareSingleImageArr } from '@/lib/model-utils';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { AVPlaybackStatusSuccess, Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [processingResults, setProcessingResults] = useState<ResultItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const videoRef = useRef<Video>(null);
  const frameSkip = 5000;

  const processVideoMulticlass = () => async () => {
    setIsProcessing(true);
    setProcessingResults([]);  
    const videoElement = videoRef.current;

    if (videoElement) {
      const status = await videoElement.getStatusAsync();
      const totalDuration = (status as AVPlaybackStatusSuccess).durationMillis || 0;
      const results = [];

      const model = await loadModel();
      for (let currentTime = 0; currentTime < totalDuration; currentTime += frameSkip) {
        const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri!, { time: currentTime });
        const preparedImage = await prepareSingleImageArr(uri);
        const prediction = model.predict(preparedImage) as tf.Tensor;
        const predictionData = await prediction.data();

        const detectedClass = predictionData.indexOf(Math.max(...predictionData));
        results.push({
          time: currentTime / 1000,
          label: `${detectedClass}`,
        });
      }

      setProcessingResults(getPresetForResult(results));
    }
    setIsProcessing(false);
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
      setProcessingResults(getPresetForResult([]));
    }
  };

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      const position = status.positionMillis;
      
      const activeImage = processingResults.find(
        (item) => position >= item.start && position <= item.end
      );

      if (activeImage) {
        setCurrentImage(getImageByClass(activeImage.classId));
      } else {
        setCurrentImage(null);
      }
    }
  };

  const handleProcessVideo = () => {
    processVideoMulticlass()
    setIsProcessing(true);
    const randomSeconds = Math.floor(Math.random() * 4) + 7;
    setTimeout(() => {
      setIsProcessing(false);
    }, randomSeconds * 1000);
  };

  return (
    <View style={styles.container}>
      <ThemedButton title={'Додати відео'} onPress={pickVideo}/>
      {videoUri && (
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            useNativeControls
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            style={styles.video}
          />
          <ThemedButton title={'Обробити відео'} onPress={handleProcessVideo} disabled={isProcessing} />
          {isProcessing && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#00235c" />
              <Text style={styles.loadingText}>Обробка відео...</Text>
            </View>
          )}
          <View style={styles.overlay}>
            {currentImage ? (
              <Image source={currentImage} style={styles.image} resizeMode={'contain'} />
            ) : (
              <Text style={styles.noImageText}>No image for this time</Text> // Може бути пусто або текст
            )}
      </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  videoContainer: {
    marginTop: 20,
    width: '90%',
    alignItems: 'center'
  },
  video: {
    width: '100%',
    height: 300,
  },
  overlay: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: -10,
    bottom: 0,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  resultText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  noImageText: {
    fontSize: 16,
    color: 'white',
  },
  image: {
    width: 100,
    height: 100,
  },
  loaderContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#00235c',
  },
});
