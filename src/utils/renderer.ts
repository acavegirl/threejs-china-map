import * as THREE from "three";

export function initRenderer(currentDom: HTMLElement) {
  /**
   * 渲染器
   */
  const renderer = new THREE.WebGLRenderer({ canvas: currentDom });

  return renderer;
}
