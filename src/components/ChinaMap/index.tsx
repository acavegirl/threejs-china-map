import { useEffect, useRef } from "react";
import * as THREE from "three";

import { GeoJsonType } from "@/types/geojson";
import { ProjectionFnParamType } from "@/types/chinaMap";

import { initScene } from "@/utils/scene";
import { initCamera } from "@/utils/camera";
import { initRenderer } from "@/utils/renderer";
import { generateMapObject3D, generateMapSpot, drawPointModel, generateParticlesBG } from "@/utils/drawMap";
import { zoomMap, modelAnime, spotAnime } from "@/utils/anime";
import { initLight } from "@/utils/light";
import { getGLBModel } from "@/utils/getModels";
import { initRenderPass } from "@/utils/renderPass";
import { initOutlinePass } from "@/utils/outlinePass";
import { initComposer } from "@/utils/effectComposer";
import { initAxesHelper } from "@/utils/helper";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";


interface Props {
  geoJson: GeoJsonType;
  projectionFnParam: ProjectionFnParamType; // 地图中心和缩放
}

export default (props: Props) => {
  const { geoJson, projectionFnParam } = props;

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
     * 初始化模型（绘制3D模型）
     */
    const { mapObject3D, label2dData } = generateMapObject3D(geoJson, projectionFnParam);
    scene.add(mapObject3D);

    /**
     * 绘制点位, 圆点，圆环
     */
    const { spotObject3D, spotList } = generateMapSpot(label2dData);
    mapObject3D.add(spotObject3D);

    /**
     * 加载model，用label2dData映射
     */
    let modelMixer: THREE.AnimationMixer[] = []
    const glbPromise = getGLBModel("/models/cone.glb")
    glbPromise.then(glb => {
      const { modelObject3D, modelMixer: modelMixerInstance} = drawPointModel(glb, label2dData)
      modelMixer = modelMixerInstance
      mapObject3D.add(modelObject3D);
    })
    

    /**
     * 粒子背景
     */
    const particles = generateParticlesBG()
    scene.add(particles)

    /**
     * 光源
     */
    const light = initLight()
    scene.add(light)

    /**
     * 通道 & 组合器
     */
    const renderPass = initRenderPass(scene, camera)
    const outlinePass = initOutlinePass(scene, camera, mapObject3D)
    const composer = initComposer(renderer)
    composer.addPass(renderPass);
    composer.addPass(outlinePass);

    /**
     * 第一次加载时，地图放大效果动画
     */
    zoomMap(mapObject3D, mapRef.current);

    /**
     * 持续动画
     */
    const clock = new THREE.Clock();
    const animate = function () {
      modelAnime(clock, modelMixer)
      spotAnime(spotList)
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


    /**
     * 视窗resize
     */
    const onResizeEvent = () => {
      if (!renderer.domElement) return;
      const canvas = renderer.domElement
      // 更新摄像头
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      console.log(canvas.clientWidth)
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


  }, [geoJson, mapRef])

  return (<>
    <canvas ref={mapRef} />
  </>)
}