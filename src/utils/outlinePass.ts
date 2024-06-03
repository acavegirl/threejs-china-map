import * as THREE from 'three';
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass';
import { mapConfig } from '@/configs/chinaMap';

/**
 * 初始化
 */
export function initOutlinePass(scene: THREE.Scene, camera: THREE.Camera, mapObject3D: THREE.Object3D) {
  let outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera,
    [mapObject3D]
  );
  const {outlinePass: outlinePassConfig } = mapConfig
  // 将此通道结果渲染到屏幕
  outlinePass.renderToScreen = outlinePassConfig.renderToScreen
  outlinePass.edgeGlow = outlinePassConfig.edgeGlow // 发光强度
  outlinePass.usePatternTexture = outlinePassConfig.usePatternTexture // 是否使用纹理图案
  outlinePass.edgeThickness = outlinePassConfig.edgeThickness // 边缘浓度
  outlinePass.edgeStrength = outlinePassConfig.edgeStrength // 边缘的强度，值越高边框范围越大
  outlinePass.pulsePeriod = outlinePassConfig.pulsePeriod// 闪烁频率，值越大频率越低
  outlinePass.visibleEdgeColor.set(outlinePassConfig.visibleEdgeColor) // 呼吸显示的颜色
  outlinePass.hiddenEdgeColor.set(outlinePassConfig.hiddenEdgeColor)

  return outlinePass
}