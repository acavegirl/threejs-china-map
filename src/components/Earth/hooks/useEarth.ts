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

  const [citiesRing, setCitiesRing] = useState([])
  const flySpotListRef = useRef<any>([])

  const ringPositionsRef = useRef<any>([])


  /**
   * 加载灯光
   */
  const loadLights = () => {
    const light = initAmbientLight(2)
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

  const loadSkydemo = () => {
    const skydomeTexture = new THREE.TextureLoader().load('https://storage.googleapis.com/umas_public_assets/michaelBay/free_star_sky_hdri_spherical_map_by_kirriaa_dbw8p0w%20(1).jpg')
    const skydomeMaterial = new THREE.MeshBasicMaterial( { map: skydomeTexture, side: THREE.DoubleSide})
    const skydomeGeometry = new THREE.SphereGeometry(120,50,50)
    const skydome = new THREE.Mesh(skydomeGeometry, skydomeMaterial);
    skydome.rotateX(Math.PI/2)
    scene.current?.add(skydome);
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
    // 这里贴图可能加载缓慢
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
      cloud.rotation.y += 0.002
      // earthObject3DRef.current.rotation.y +=0.005
    })
  }

  /**
   * 加载坐标点
   */
  const loadSpots = () => {
    const mat = new THREE.MeshBasicMaterial( { color: 0xffff00, side: THREE.DoubleSide } );
    const citiesRingArr: any = []
    cities.forEach(city => {
      const geo = new THREE.RingGeometry( 0.2, 0.13, 32 );
      const ring = new THREE.Mesh( geo, mat );
      const cityEciPosition = lonLauToRadian(city.lon, city.lat, 9.3)
      // 指定位置給圖釘
      ring.position.set(cityEciPosition.x, -cityEciPosition.z, -cityEciPosition.y)
      // 这里ring的坐标轴是地球坐标轴，不是世界坐标轴
      // 圖釘永遠都看像世界中心，所以不會歪斜
      ring.lookAt(new THREE.Vector3(0,0,0))
      earthObject3DRef.current.add(ring)
      citiesRingArr.push({
        ...city,
        position: ring.position.toArray(),
      })
      ringPositionsRef.current.push(ring.position)
    })
    setCitiesRing(citiesRingArr)

    const uid = uuid()
    renderMixins.set(uid, ()=>{
      cameraMoveAmine(camera, control)
    })
  }

  /**
   * 加载飞线
   * start 和 end 是球坐标
   */
  const loadFlyLine = (start: THREE.Vector3, end: THREE.Vector3) => {
    const {flyLine} = createCurve3Line(start, end, 30, mapConfig.fly.spotColor, 1, 15)
    const {flyLine: flyLineBG} = createCurve3Line(start, end, 300, mapConfig.fly.lineColor, mapConfig.fly.lineOpacity, 15)
    earthObject3DRef.current.add(flyLineBG)
    earthObject3DRef.current.add(flyLine)
    flySpotListRef.current.push(flyLine)
  }

  const loadCylinder = (posArr: PosV3[]) => {
    posArr.forEach((item:PosV3, index:number) => {
      const geometry = new THREE.CylinderGeometry( 1, 1, (index+1)*15, 32 ); 
      const material = new THREE.MeshBasicMaterial( {color: 0xffff00} ); 
      const cylinder = new THREE.Mesh( geometry, material );
      cylinder.scale.set(0.1, 0.1, 0.1)
      cylinder.position.set(...item)
      cylinder.lookAt(new THREE.Vector3(0,0,0))
      cylinder.rotateX(Math.PI/2)
      earthObject3DRef.current.add(cylinder)
    })
  }

  // 选择城市后的回调
  const selectCity = (position: PosV3) => {
    if (!camera.current) return
    // 传入的是ring的地球坐标，要转成世界坐标
    // camera.current?.position.set(-position[0], position[2], position[1]).multiplyScalar(5)
    // control.current?.update()
    
    // 當用戶選城市時，更新lerp移動的結果參數
	  let lerpTarget = new THREE.Vector3(0,0,0).set(-position[0], position[2], position[1]).multiplyScalar(5)
    initLerp(lerpTarget, camera.current.position.toArray(), 1)
    // 这里不能调用set anime，set amine不能放在回调里
  }

  useEffect(() => {
    if (!container.current || !control.current || !axesHelper.current) return;

    loadModels([
    ]).then(()=>{
      loadSkydemo()
      loadEarth()
    }).then(()=> {
      loadLights()
      scene.current?.add(axesHelper.current as THREE.AxesHelper)
      loadSpots()
      loadFlyLine(ringPositionsRef.current[0], ringPositionsRef.current[1])
      loadFlyLine(ringPositionsRef.current[2], ringPositionsRef.current[3])
      loadCylinder([ringPositionsRef.current[4], ringPositionsRef.current[5]])
      const uid = uuid()
      renderMixins.set(uid, ()=>{
        flyTrailAnime(flySpotListRef.current)
      })
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
    selectCity,
    citiesRing
  }
}

export default useEarth
