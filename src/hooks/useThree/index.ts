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
import { useLoadingStore } from "@/store/loading";

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
  const boxHelper = useRef<THREE.BoxHelper>()

  // 模型动画
  const modelMixers: any = []
  const clock = new THREE.Clock()
  // 动画
  const renderMixins = new Map()

  const { setLoading } = useLoadingStore((state) => ({
    setLoading: state.setLoading,
  }))

  useEffect(() => {
    if (!container.current) return;

    ({
      scene: scene.current,
      camera: camera.current,
      renderer: renderer.current,
      // CSSRenderer: CSSRenderer.current,
      renderPass: renderPass.current,
      composer: composer.current,
      control: control.current,
      axesHelper: axesHelper.current,
      boxHelper: boxHelper.current,
    } = new ThreeBase(container.current, cameraPos))
  }, [container.current])


  // 通用方法
  const loadGLTF = (url: string): Promise<GLTF> => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(`${process.env.PUBLIC_URL}/draco/`);
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

  /**
   * 异步加载模型
   * @param tasks
   */
  const loadModels = async (tasks: Promise<any>[]) => {
    setLoading(true)
    await Promise.all(tasks)
    setLoading(false)
  }

  const render = () => {
    const mixerUpdateDelta = clock.getDelta()
    modelMixers.forEach((mixer: any) => mixer.update(mixerUpdateDelta))

    composer.current && (composer.current as EffectComposer).render();

    renderMixins.forEach((mixin) => mixin())
    CSSRenderer.current && scene.current && camera.current && (CSSRenderer.current as CSS2DRenderer).render(scene.current, camera.current)

    requestAnimationFrame(() => render())
  }

  const addBoxHelper = () => {
    (scene.current as THREE.Scene).add((boxHelper.current as THREE.BoxHelper))
  }
  const setBoxHelperVisibility = (visibility: boolean) => {
    (boxHelper.current as THREE.Object3D).visible = visibility;
  }
  const setBoxHelperObj = (obj: THREE.Object3D)=> {
    (boxHelper.current as THREE.BoxHelper).setFromObject(obj);
    setBoxHelperVisibility(true);
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
    renderOnce,
    addBoxHelper,
    setBoxHelperObj,
    setBoxHelperVisibility,
    loadModels,
  }
}
