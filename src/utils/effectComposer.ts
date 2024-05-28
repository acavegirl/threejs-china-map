import * as THREE from 'three';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';

/**
 * 初始化
 */
export function initComposer(renderer: THREE.WebGLRenderer) {
  const composer = new EffectComposer(renderer);

  return composer
}