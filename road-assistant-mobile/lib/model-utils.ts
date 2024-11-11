import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";

export const targetSize = 244;

export const loadModel = async () => {
  const modelJson = require('@/assets/modelv5/model.json');
  const modelWeights = [
    require('@/assets/modelv5/group1-shard1of3.bin'),
    require('@/assets/modelv5/group1-shard2of3.bin'),
    require('@/assets/modelv5/group1-shard3of3.bin'),
  ];
  return await tf .loadLayersModel(bundleResourceIO(modelJson, modelWeights));
};

export const prepareSingleImageArr = async (uri: string): Promise<tf.Tensor> => {
  const response = await fetch(uri);
  const imageData = await response.blob();
  const imageTensor = tf.browser.fromPixels(await createImageBitmap(imageData));
  return tf.image.resizeBilinear(imageTensor, [targetSize, targetSize]).div(255.0).expandDims();
};
