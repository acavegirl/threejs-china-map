import * as THREE from 'three'
import { useThree } from '@/hooks'
import { initAmbientLight, initDirectionalLight, initPointLight } from '@/utils/light'
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
import { cameraMoveAmine, flyTrailAnime, initLerp } from '@/utils/anime'
import { createCurve3Line } from '@/utils/drawMap'
import { mapConfig } from '@/configs/chinaMap'

export const cities = [
	{ label: "Mumbai", value: 1356226629, lat: 19.0758, lon: 72.8775, country: "India" },
	{ label: "Moscow", value: 1643318494, lat: 55.7558, lon: 37.6178, country: "Russia" },
	{ label: "Xiamen", value: 1156212809, lat: 24.4797, lon: 118.0819, country: "China" },
	{ label: "Phnom Penh", value: 1116260534, lat: 11.5696, lon: 104.9210, country: "Cambodia" },
	{ label: "Chicago", value: 1840000494, lat: 41.8373, lon: -87.6862, country: "United States" },
	{ label: "Bridgeport", value: 1840004836, lat: 41.1918, lon: -73.1953, country: "United States" },
	{ label: "Mexico City", value: 1484247881, lat:19.4333, lon: -99.1333 , country: "Mexico" },
	{ label: "Karachi", value: 1586129469, lat:24.8600, lon: 67.0100 , country: "Pakistan" },
	{ label: "London", value: 1826645935, lat:51.5072, lon: -0.1275 , country: "United Kingdom" },
	{ label: "Boston", value: 1840000455, lat:42.3188, lon: -71.0846 , country: "United States" },
	{ label: "Taichung", value: 1158689622, lat:24.1500, lon: 120.6667 , country: "Taiwan" },
]

// export const citiesRing: any = []

export function useSolarSystem() {
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

  const [citiesRing, setCitiesRing] = useState([])
  const flySpotListRef = useRef<any>([])

  const ringPositionsRef = useRef<any>([])


  /**
   * 加载灯光
   */
  const loadLights = () => {
    const light = initAmbientLight(2)
    scene.current?.add(light)

    // 模拟太阳光
    const pointLight = initPointLight([0, 0, 0], 10)
    scene.current?.add(pointLight)
  }

  // 加载宇宙背景
  const loadSkydemo = () => {
    const skydomeTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w%20(1).jpg')
    const skydomeMaterial = new THREE.MeshBasicMaterial( { map: skydomeTexture, side: THREE.DoubleSide})
    const skydomeGeometry = new THREE.SphereGeometry(120,50,50)
    const skydome = new THREE.Mesh(skydomeGeometry, skydomeMaterial);
    skydome.rotateX(Math.PI/2)
    scene.current?.add(skydome);
  }

  // 加载平面网格
  const loadPlane = () => {
  }

  const loadStarBG = () => {
  }

  useEffect(() => {
    if (!container.current || !control.current || !axesHelper.current) return;

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
    citiesRing
  }
}

export default useSolarSystem
