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
import sunTextureImg from "@/assets/img/sunmap.jpg"

// export const citiesRing: any = []
const starData =
  {
    name: "太阳",//球体名称
    mapImg: sunTextureImg,//球体贴图
    size: 696000,//球体尺寸
    position: [0, 0, 0],//位置(x，y，z)
    rotation: 0,//自转速度
    revolution: 0,//公转速度
    data: {
      sunDistance: "0km",
      weight: "1.989e30kg",
      diameter: "1392000km",
      rotation: "36day",
      revolution: "",
      temp: "5500℃",
      atmosphere: "氮气、氧气、氩气",
      msg: "太阳是在大约45.7亿年前在一个坍缩的氢分子云内形成。太阳是太阳系里唯一的恒星，是太阳系的中心天体。"
    }
  }

export function useStar(starData: any) {
  const starObject3DRef = useRef<any>()

  /**
   * 加载星体
   */
  const loadStar = () => {
    starObject3DRef.current = new THREE.Object3D()
    const geometry = new THREE.SphereGeometry(starData.size, 60, 60);
    const texture = new THREE.TextureLoader().load(starData.mapImg);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })
    const star = new THREE.Mesh(geometry, material)
    starObject3DRef.current.add(star)
  }

  return {
    starObject3DRef
  }
}

export default useStar
