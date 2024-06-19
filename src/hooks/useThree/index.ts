import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import type { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import * as THREE from 'three'
import ThreeBase from './ThreeBase'
import { useEffect, useRef, useState } from 'react'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PosV3 } from '@/types/data'

export default (cameraPos: PosV3) => {
  const container = useRef()
  const scene = useRef<THREE.Scene>()
  const camera = useRef<THREE.PerspectiveCamera>()
  const renderer = useRef<THREE.WebGLRenderer>()
  const CSSRenderer = useRef<CSS2DRenderer>()
  const renderPass = useRef<RenderPass>()
  const composer = useRef<EffectComposer>()
  const control = useRef<OrbitControls>()
  const axesHelper = useRef<THREE.AxesHelper>()

  // 模型动画
  const modelMixers: any = []
  const clock = new THREE.Clock()
  // 动画
  const renderMixins = new Map()

  useEffect(() => {
    if (!container.current) return;

    ({
      scene: scene.current,
      camera: camera.current,
      renderer: renderer.current,
      CSSRenderer: CSSRenderer.current,
      renderPass: renderPass.current,
      composer: composer.current,
      control: control.current,
      axesHelper: axesHelper.current,
    } = new ThreeBase(container.current, cameraPos))
  }, [container.current])


  // 通用方法
  const loadGLTF = (url: string): Promise<GLTF> => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);
    const onCompleted = (object: GLTF, resolve: any) => resolve(object)
    return new Promise<GLTF>((resolve) => {
      loader.load(url, (object: GLTF) => onCompleted(object, resolve))
    })
  }

  const loadAnimate = (
    mesh: THREE.Mesh | THREE.AnimationObjectGroup | THREE.Group,
    animations: Array<THREE.AnimationClip>
  ) => {
    const mixer = new THREE.AnimationMixer(mesh)
    const clonedAnimations = animations.map((clip) => {
      return clip.clone();
    });
    clonedAnimations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
    modelMixers.push(mixer)
    return undefined
  }

  const renderOnce = () => {
    composer.current && (composer.current as EffectComposer).render();
    renderMixins.forEach((mixin) => mixin())
    CSSRenderer.current && scene.current && camera.current && (CSSRenderer.current as CSS2DRenderer).render(scene.current, camera.current)
  }

  const render = () => {
    const mixerUpdateDelta = clock.getDelta()
    modelMixers.forEach((mixer: any) => mixer.update(mixerUpdateDelta))

    composer.current && (composer.current as EffectComposer).render();

    renderMixins.forEach((mixin) => mixin())
    CSSRenderer.current && scene.current && camera.current && (CSSRenderer.current as CSS2DRenderer).render(scene.current, camera.current)

    requestAnimationFrame(() => render())
  }

  return {
    container,
    scene,
    camera,
    axesHelper,
    renderer,
    CSSRenderer,
    renderPass,
    composer,
    control,
    modelMixers,
    clock,
    renderMixins,
    render,
    loadGLTF,
    loadAnimate,
    renderOnce
  }
}
