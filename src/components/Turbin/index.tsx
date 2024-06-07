import { useEffect, useRef } from "react";
import * as THREE from "three";

import { GeoJsonType } from "@/types/geojson";
import { ProjectionFnParamType } from "@/types/chinaMap";

import { initScene } from "@/utils/scene";
import { initCamera } from "@/utils/camera";
import { initRenderer } from "@/utils/renderer";
import { generateMapObject3D, generateMapSpot, drawPointModel, generateParticlesBG, generateFlyLine, XYCoordType, generateFlyLineTrail, drawPlaneModel, generateStarBG, loadModel } from "@/utils/drawMap";
import { zoomMap, modelAnime, spotAnime, flyAnime, flyTrailAnime, planeAnime } from "@/utils/anime";
import { initAmbientLight, initDirectionalLight } from "@/utils/light";
import { getGLBModel } from "@/utils/getModels";
import { initRenderPass } from "@/utils/renderPass";
import { initOutlinePass } from "@/utils/outlinePass";
import { initComposer } from "@/utils/effectComposer";
import { initAxesHelper, initDirectionalLightHelper } from "@/utils/helper";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { mapConfig } from "@/src/configs/chinaMap";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";


export default () => {

  const mapRef = useRef<any>();
  const onResizeEventRef = useRef<any>()

  useEffect(() => {
    if (!mapRef.current) return;

    /**
     * 初始化场景
     */
    const scene = initScene();

    /**
     * 初始化摄像机
     */
    const camera = initCamera(mapRef.current);

    /**
     * 初始化渲染器
     */
    const renderer = initRenderer(mapRef.current);

    
    /**
     * 加载model，用label2dData映射
     */
    let modelMixer: THREE.AnimationMixer[] = []
    const glbPromise = getGLBModel("/models/turbine.glb")
    glbPromise.then(glb => {
      const { modelObject3D, modelMixer: modelMixerInstance} = loadModel(glb)
      modelMixer = modelMixerInstance
      scene.add(modelObject3D);
    })


    /**
     * 粒子背景
     */
    const particles = generateStarBG()
    scene.add(particles)

    /**
     * 光源
     */
    // const light0 = initAmbientLight(3)
    const light1 = initDirectionalLight([0, 40, 6], 3)
    const light2 = initDirectionalLight([-30, -80, 6], 10)
    const light3 = initDirectionalLight([0, 0, 10], 3)
    // scene.add(light0)
    scene.add(light1)
    scene.add(light2)
    scene.add(light3)

    /**
     * 通道 & 组合器
     */
    const renderPass = initRenderPass(scene, camera)
    // const outlinePass = initOutlinePass(scene, camera, mapObject3D)
    const composer = initComposer(renderer)
    composer.addPass(renderPass);

    
    /**
     * 持续动画
     */
    const clock = new THREE.Clock();
    const animate = function () {
      modelAnime(clock, modelMixer)
      composer.render();
      requestAnimationFrame(animate);
    };
    animate();

    /**
     * 初始化控制器
     */
    new OrbitControls(camera, renderer.domElement);

    /**
     * helper 辅助开发使用
     */
    const axesHelper = initAxesHelper()
    scene.add(axesHelper);
    const lightHelper1 = initDirectionalLightHelper(light1)
    const lightHelper2 = initDirectionalLightHelper(light2)
    const lightHelper3 = initDirectionalLightHelper(light3)
    scene.add(lightHelper1);
    scene.add(lightHelper2);
    scene.add(lightHelper3);

    /**
     * 视窗resize
     */
    const onResizeEvent = () => {
      if (!renderer.domElement) return;
      const canvas = renderer.domElement
      // 更新摄像头
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      // 更新摄像机的投影矩阵
      camera.updateProjectionMatrix();
      // 更新渲染器
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      // 设置渲染器的像素比例
      renderer.setPixelRatio(window.devicePixelRatio);
    };
    onResizeEvent()
    onResizeEventRef.current = onResizeEvent
    window.addEventListener("resize", onResizeEvent);

    return () => {
      if (onResizeEventRef.current) {
        window.removeEventListener("resize", onResizeEventRef.current);
      }
      
    };
  }, [mapRef])

  return (<>
    <canvas ref={mapRef} />
  </>)
}