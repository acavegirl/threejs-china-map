import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";


export const getGLBModel = (url: string) => {
  // Models
  // coneUncompression.glb 是压缩过的模型，需要用dracoLoader加载
  // cone.glb 是未压缩，用 gltfLoader 加载即可
  const loader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/");
  loader.setDRACOLoader(dracoLoader);

  return loader.loadAsync(url)
}

