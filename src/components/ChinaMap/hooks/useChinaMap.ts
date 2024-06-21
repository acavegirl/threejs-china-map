import * as THREE from 'three'
import { useThree } from '@/hooks'
import { initDirectionalLight } from '@/utils/light'
import { LightData, PosV3 } from '@/types/data'
import { useCallback, useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { XYCoordType, generateFlyLineTrail, generateMapObject3D, generateMapSpot, generateParticlesBG } from '@/utils/drawMap'
import { initDirectionalLightHelper } from '@/utils/helper'
import { flyTrailAnime, particlesAnime, spotAnime, zoomMap } from '@/utils/anime'
import { ProjectionFnParamType } from '@/types/chinaMap'
import { GeoJsonType } from '@/types/geojson'
import axios from 'axios'
import { mapConfig } from '@/configs/chinaMap'
import { size } from 'lodash'
import { useLayerStore } from "@/store/layer";
import ChinaGeoJson from '@/assets/json/ChinaGeo.json';
import ChinaBorderGeoJson from '@/assets/json/ChinaBorderGeo.json';

export function useChinaMap() {
  const { setLayerInfo } = useLayerStore((state) => ({
    setLayerInfo: state.setLayerInfo
  }))
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
  } = useThree([5, -60, 100])

  const onResizeEventRef = useRef<any>()
  const clickEventRef = useRef<any>()

  const mapObject3DRef = useRef<any>(new THREE.Object3D())
  const label2dDataRef = useRef<any>()
  const modelObject3DRef = useRef<any>(new THREE.Group())

  const [loading, setLoading] = useState(false)

  const [geoJson, setGeoJson] = useState<GeoJsonType>();
  const [borderGeoJson, setBorderGeoJson] = useState<GeoJsonType>();
  const [mapAdCode, setMapAdCode] = useState<number>(100000);
  // 地图中心和缩放比例，用于进行坐标投影
  const [projectionFnParam, setProjectionFnParam] =
    useState<ProjectionFnParamType>({
      center: [104.0, 37.5],
      scale: 30,
    });

  // useEffect(() => {
  //   queryMapData(mapAdCode); // 默认的中国adcode码
  // }, [mapAdCode]);

  // 请求地图数据
  // const queryMapData = useCallback(async (code: number) => {
  //   const response = await axios.get(
      // `https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json`
  //   );
  //   const { data } = response;

  //   const borderResponse = await axios.get(
      // `https://geo.datav.aliyun.com/areas_v3/bound/100000.json`
  //   const { data: borderData } = borderResponse;
  //   setGeoJson(data);
  //   setBorderGeoJson(borderData);
  // }, []);
  
  const setMapData = () => {
    const data = Object(ChinaGeoJson);
    const borderData = Object(ChinaBorderGeoJson);
    setGeoJson(data);
    setBorderGeoJson(borderData);
  }

  useEffect(()=>{
    setMapData()
  }, [])


  /**
   * 加载灯光
   */
  const loadLights = () => {
    const lightData: LightData = [
      [[0, 40, 6], 3],
      [[-30, -80, 6], 10],
      // [[0, 0, 10], 3],
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
    // 粒子背景
    const particles = generateParticlesBG()
    scene.current?.add(particles)
    // 加入动画列表
    const uid = uuid()
    renderMixins.set(uid, () => {
      particlesAnime(particles)
    })
  }

  /**
   * 加载地图
   */
  const loadMap = () => {
    const { mapObject3D, label2dData} = generateMapObject3D((geoJson as GeoJsonType), (borderGeoJson as GeoJsonType), projectionFnParam);
    label2dDataRef.current = label2dData;
    mapObject3DRef.current.add(mapObject3D);
  }

  /**
   * 加载圆点
   */
  const loadSpots = () => {
    const { spotObject3D, spotList } = generateMapSpot(label2dDataRef.current);
    mapObject3DRef.current.add(spotObject3D);
    const uid = uuid()
    renderMixins.set(uid, () => {
      spotAnime(spotList)
    })
  }

  /**
   * 加载点模型
   */
  const loadPointModel = async () => {
    const { scene: sceneModel, animations } = await loadGLTF(`${process.env.PUBLIC_URL}/models/cone.glb`)
    // 多个点的model
    // const modelObject3D = new THREE.Object3D();

    label2dDataRef.current.forEach((item: any) => {
      const { featureCenterCoord } = item;
      const clonedModel = sceneModel.clone();
      loadAnimate(clonedModel, animations)

      // 设置模型位置
      clonedModel.position.set(
        featureCenterCoord[0],
        -featureCenterCoord[1],
        mapConfig.spotZIndex
      );
      // 设置模型大小
      clonedModel.scale.set(0.2, 0.2, 0.6);
      // clonedModel.rotateX(-Math.PI / 8);
      // 在模型上挂载数据
      clonedModel.userData = {id: `${clonedModel.position.x}_${clonedModel.position.y}`}
      modelObject3DRef.current.add(clonedModel);
      
    });
    mapObject3DRef.current.add(modelObject3DRef.current);
  }

  // 坐标点点击事件
  const onModelClick = () => {
    const handler = (event: MouseEvent) => {
      if (!container.current) return;
      const el = container.current as HTMLElement
      const mouse = new THREE.Vector2(
        (event.clientX / el.offsetWidth) * 2 - 1,
        -(event.clientY / el.offsetHeight) * 2 + 1
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera.current!)
      const intersects = raycaster.intersectObject(modelObject3DRef.current!, true)
      if (size(intersects) <= 0) return undefined
      const pointModel = <any>intersects[0].object
      console.log('pointModel', pointModel.parent.userData)
      setLayerInfo({
        id: pointModel.parent.userData.id,
        type: 'factory',
      })
    }
    document.addEventListener('dblclick', handler)
    clickEventRef.current = handler
  }

  /**
   * 飞线
   */
  const loadFlyLine = () => {
    const LineData: [XYCoordType, XYCoordType][] = [
      [label2dDataRef.current[0].featureCenterCoord, label2dDataRef.current[4].featureCenterCoord],
      [label2dDataRef.current[8].featureCenterCoord, label2dDataRef.current[12].featureCenterCoord]
    ]
    const {flyObject3D, flySpotList} = generateFlyLineTrail(LineData)
    mapObject3DRef.current.add(flyObject3D)
    const uid = uuid()
    renderMixins.set(uid, () => {
      flyTrailAnime(flySpotList)
    })
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

  useEffect(() => {
    if (!container.current || !borderGeoJson || !geoJson || !axesHelper.current || !control.current) return;
    // scene.current?.add(axesHelper.current)
    control.current?.target.setX(10)
    loadBG()
    loadLights()
    loadMap()
    loadSpots()
    loadFlyLine()
    loadModels([
      loadPointModel(),
    ]).then(()=> {
      scene.current?.add(mapObject3DRef.current)
      control.current?.update()
      zoomMap(mapObject3DRef.current, (container.current as unknown as HTMLElement));
      onModelClick()
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
        document.removeEventListener('dblclick', clickEventRef.current)
      }
    };
  }, [geoJson, borderGeoJson])

  return {
    container,
  }
}

export default useChinaMap
