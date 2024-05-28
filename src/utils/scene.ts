import * as THREE from 'three';
import { sceneConfig } from '@/src/configs/chinaMap';

/**
 * 初始化场景
 */
export function initScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(sceneConfig.backgroundColor)
  return scene;
}
