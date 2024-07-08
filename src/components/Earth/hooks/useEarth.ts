import * as THREE from 'three'
import { useThree } from '@/hooks'
import { initAmbientLight, initDirectionalLight } from '@/utils/light'
import { LightData, PosV3 } from '@/types/data'
import { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import earthTextureImg from "@/assets/img/earth.jpg"
import displacementTextureImg from "@/assets/img/earth_displacement.jpg"
import metalnessTextureImg from "@/assets/img/earth_metalness.jpg"
import bumpTextureImg from "@/assets/img/earth_bump.jpg"
import roughnessTextureImg from "@/assets/img/earth_roughness.png"
import cloudsTextureImg from "@/assets/img/earth_clouds.jpg"


export function useEarth() {

  const {
    container,
    scene,
    camera,
    axesHelper,
    renderer,
    loadGLTF,
    loadAnimate,
    renderMixins,
    render,
    control,
    loadModels,
  } = useThree([0, -100, 20])

  const onResizeEventRef = useRef<any>()


  /**
   * 加载灯光
   */
  const loadLights = () => {
    const light = initAmbientLight(3)
    scene.current?.add(light)
    const lightData: LightData = [
      [[60, -80, 6], 3],
    ]
    lightData.map((data: [PosV3, number]) => {
      const light = initDirectionalLight(...data)
      scene.current?.add(light)
      // const lightHelper = initDirectionalLightHelper(light)
      // scene.current?.add(lightHelper);
    })
  }

  /**
   * 加载背景
   */
  const loadBG = () => {
    
  }

  /**
   * 加载地图
   */
  const loadEarth = () => {
    const earthObject3D = new THREE.Object3D()
    // 半径，宽度片段数，高度片段数
    const earthGeometry = new THREE.SphereGeometry(10, 600, 600);
    const earthTexture = new THREE.TextureLoader().load(earthTextureImg);
    const displacementTexture = new THREE.TextureLoader().load(displacementTextureImg);
    const metalnessTexture = new THREE.TextureLoader().load(metalnessTextureImg)
    const roughnessTexture = new THREE.TextureLoader().load(roughnessTextureImg)
    const bumpTexture = new THREE.TextureLoader().load(bumpTextureImg)
    const earthMaterial = new THREE.MeshStandardMaterial({
        map: earthTexture,
        displacementMap: displacementTexture,
        metalnessMap: metalnessTexture,
        roughnessMap: roughnessTexture,
        bumpMap: bumpTexture,
        side: THREE.DoubleSide,
        displacementScale: 0.5,
	      metalness:1,
    })
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)

    const cloudGeometry = new THREE.SphereGeometry(10.3,60,60)
    const cloudTransparency = new THREE.TextureLoader().load(cloudsTextureImg)
    const cloudMaterial = new THREE.MeshStandardMaterial({
      transparent: true,
      opacity: 1,
      alphaMap: cloudTransparency
    })
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);

    earthObject3D.add(earth)
    earthObject3D.add(cloud)
    earthObject3D.rotateX(Math.PI/2)
    earthObject3D.rotateY(Math.PI)
    scene.current?.add(earthObject3D)
    const uid = uuid()
    renderMixins.set(uid, ()=>{
      earth.rotation.y +=0.005
	    cloud.rotation.y +=0.004
    })
  }

  /**
   * 加载圆点
   */
  const loadSpots = () => {
  }


  // 坐标点点击事件
  const onModelClick = () => {
    
  }


  useEffect(() => {
    if (!container.current || !control.current || !axesHelper.current) return;

    loadModels([
    ]).then(()=> {
      loadLights()
      scene.current?.add(axesHelper.current as THREE.AxesHelper)
      loadEarth()
      control.current?.update()
      render()
    })

    const onResizeEvent = () => {
      if (!renderer.current?.domElement || !camera.current) return;
      const canvas = renderer.current.domElement
      // 更新摄像头
      camera.current.aspect = canvas.clientWidth / canvas.clientHeight;
      // 更新摄像机的投影矩阵
      camera.current.updateProjectionMatrix();
      // 更新渲染器
      renderer.current.setSize(canvas.clientWidth, canvas.clientHeight, false);
      // 设置渲染器的像素比例
      renderer.current.setPixelRatio(window.devicePixelRatio);
      
    };
    onResizeEvent()
    onResizeEventRef.current = onResizeEvent
    window.addEventListener("resize", onResizeEvent);

    return () => {
      if (onResizeEventRef.current) {
        window.removeEventListener("resize", onResizeEventRef.current);
      }
    };
  }, [])

  return {
    container,
  }
}

export default useEarth
