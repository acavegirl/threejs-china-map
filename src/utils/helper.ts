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