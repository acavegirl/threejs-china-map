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
import { lonLauToRadian } from '@/utils/transform'

const cities = [
	{ name: "Mumbai", id: 1356226629, lat: 19.0758, lon: 72.8775, country: "India" },
	{ name: "Moscow", id: 1643318494, lat: 55.7558, lon: 37.6178, country: "Russia" },
	{ name: "Xiamen", id: 1156212809, lat: 24.4797, lon: 118.0819, country: "China" },
	{ name: "Phnom Penh", id: 1116260534, lat: 11.5696, lon: 104.9210, country: "Cambodia" },
	{ name: "Chicago", id: 1840000494, lat: 41.8373, lon: -87.6862, country: "United States" },
	{ name: "Bridgeport", id: 1840004836, lat: 41.1918, lon: -73.1953, country: "United States" },
	{ name: "Mexico City", id: 1484247881, lat:19.4333, lon: -99.1333 , country: "Mexico" },
	{ name: "Karachi", id: 1586129469, lat:24.8600, lon: 67.0100 , country: "Pakistan" },
	{ name: "London", id: 1826645935, lat:51.5072, lon: -0.1275 , country: "United Kingdom" },
	{ name: "Boston", id: 1840000455, lat:42.3188, lon: -71.0846 , country: "United States" },
	{ name: "Taichung", id: 1158689622, lat:24.1500, lon: 120.6667 , country: "Taiwan" },
]

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
  const earthObject3DRef = useRef<any>()


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
    earthObject3DRef.current = new THREE.Object3D()
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

    // loadSpots()

    earthObject3DRef.current.add(earth)
    earthObject3DRef.current.add(cloud)
    earthObject3DRef.current.rotateX(Math.PI/2)
    earthObject3DRef.current.rotateY(Math.PI)
    scene.current?.add(earthObject3DRef.current)
    const uid = uuid()
    renderMixins.set(uid, ()=>{
      // earth.rotation.y +=0.005
	    // cloud.rotation.y +=0.004
      earthObject3DRef.current.rotation.y +=0.005
    })
  }

  /**
   * 加载坐标点
   */
  const loadSpots = () => {
    const mat = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
    cities.forEach(city => {
      const geo = new THREE.RingGeometry( 0.2, 0.13, 32 );
      const ring = new THREE.Mesh( geo, mat );
      const cityEciPosition = lonLauToRadian(city.lon, city.lat, 9.3)
      // 指定位置給圖釘
      ring.position.set(cityEciPosition.x, -cityEciPosition.z, -cityEciPosition.y)	
      // 圖釘永遠都看像世界中心，所以不會歪斜。
      ring.lookAt(new THREE.Vector3(0,0,0))
      earthObject3DRef.current.add(ring)
    })
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
      loadSpots()
      
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
