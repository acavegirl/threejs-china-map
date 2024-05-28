import * as THREE from 'three';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';

/**
 * 初始化
 */
export function initRenderPass(scene: THREE.Scene, camera: THREE.Camera) {
  const renderScene = new RenderPass(scene, camera);
  return renderScene;
}