import * as THREE from 'three';

/**
 * 初始化
 */
export function initCameraHelper(camera: THREE.Camera) {
  const cameraHelper = new THREE.CameraHelper(camera);
  return cameraHelper
}

export function initAxesHelper() {
  const axesHelper = new THREE.AxesHelper(100);
  return axesHelper
}

export function initDirectionalLightHelper(light: THREE.DirectionalLight) {
  const lightHelper = new THREE.DirectionalLightHelper(light);
  return lightHelper
}

export function initBoxHelper(color=0x00ffff) {
  const boxHelper = new THREE.BoxHelper(new THREE.Object3D(), new THREE.Color(color));
  return boxHelper
}