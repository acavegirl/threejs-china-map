import * as THREE from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { CSS3DRenderer, CSS3DObject, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js'


export function initRenderer(currentDom: HTMLElement) {
  /**
   * 渲染器
   */
  const renderer = new THREE.WebGLRenderer({ canvas: currentDom });

  return renderer;
}

export function initCSSRender(element: HTMLElement) {
  const CSSRenderer = new CSS2DRenderer()
  CSSRenderer.setSize(element.offsetWidth, element.offsetHeight)
  CSSRenderer.domElement.style.position = 'absolute'
  CSSRenderer.domElement.style.top = '0px'
  element.appendChild(CSSRenderer.domElement)
  return CSSRenderer
}

export function initCSS3DRender(element: HTMLElement) {
  const CSSRenderer = new CSS3DRenderer()
  CSSRenderer.setSize(element.offsetWidth, element.offsetHeight)
  CSSRenderer.domElement.style.position = 'absolute'
  CSSRenderer.domElement.style.top = '0px'
  CSSRenderer.domElement.style.pointerEvents = 'none';
  document.body.appendChild(CSSRenderer.domElement);
  return CSSRenderer
}