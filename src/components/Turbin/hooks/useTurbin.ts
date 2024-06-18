import * as THREE from 'three'
import { useThree } from '@/hooks'
import { initDirectionalLight } from '@/utils/light'
import { LightData, PosV3 } from '@/types/data'
import { useEffect, useRef, useState } from 'react'
import { v4 as uuid } from 'uuid'
import { MODEL_EQUIPMENT_POSITION_PARAMS_ENUM } from '@/configs/const'
import { size } from 'lodash'
import gsap from "gsap";
import { generateParticlesBG } from '@/utils/drawMap'
import { initDirectionalLightHelper } from '@/utils/helper'
import { particlesAnime } from '@/utils/anime'

export function useTurbine() {
  // 风机模型 group
  const turbine = new THREE.Group()

  const modelSkeleton = useRef<THREE.Object3D>()
  const modelEquipment = useRef<THREE.Object3D>()

  const [loading, setLoading] = useState(false)

  const {
    container,
    scene,
    camera,
    renderer,
    control,
    loadGLTF,
    loadAnimate,
    renderMixins,
    render,
  } = useThree([8, 12, 80])

  const onResizeEventRef = useRef<any>()
  const clickEventRef = useRef<any>()

  // 加载灯光
  const loadLights = () => {
    const lightData: LightData = [
      [[0, 40, 6], 3],
      [[-30, -80, 6], 10],
      [[0, 0, 10], 3],
    ]
    lightData.map((data: [PosV3, number]) => {
      const light = initDirectionalLight(...data)
      scene.current?.add(light)
      const lightHelper = initDirectionalLightHelper(light)
      scene.current?.add(lightHelper);
    })
  }

  const loadBG = () => {
    const particles = generateParticlesBG()
    scene.current?.add(particles)
    const uid = uuid()
    renderMixins.set(uid, () => {
      particlesAnime(particles)
    })
  }
  

  // 加载风机骨架
  const loadTurbineSkeleton = async () => {
    const { scene: clonedModel, animations } = await loadGLTF("/models/turbine.glb")

    // 设置模型大小
    clonedModel.scale.set(0.005, 0.005, 0.005);
    clonedModel.rotateX(Math.PI / 2);
    loadAnimate(clonedModel, animations)
    clonedModel.name = 'skeleton'
    modelSkeleton.current = clonedModel
    skeletonAnimation(clonedModel)
    turbine.add(clonedModel)
  }
  // 加载风机设备
  const loadTurbineEquipments = async () => {
    const { scene: clonedModel } = await loadGLTF("/models/equipment.glb")
    // 设置模型大小
    clonedModel.scale.set(0.005, 0.005, 0.005);
    clonedModel.rotateX(Math.PI / 2);
    clonedModel.name = 'equipment'
    modelEquipment.current = clonedModel
    turbine.add(clonedModel)
  }

  // 风机骨架消隐动画
  const skeletonAnimation = (clonedModel: THREE.Group<THREE.Object3DEventMap> | undefined) => {
    const shellModel = modelSkeleton.current?.getObjectByName('颜色材质')
    const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 3.5)
    shellModel?.traverse((mesh) => {
      if (!(mesh instanceof THREE.Mesh)) return undefined
      mesh.material = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1,
        roughness: 0.7,
      })
      // 白色外壳消隐效果
      mesh.material.clippingPlanes = [clippingPlane]
      return undefined
    })
    // const uid = uuid()

    // renderMixins.set(uid, () => {
    //   if (clippingPlane.constant <= -0.1) {
    //     modelSkeleton.current?.remove(shellModel!)
    //     renderMixins.delete(uid)
    //     console.log('renderMixins', renderMixins)
    //   }
    //   clippingPlane.constant -= 0.01
    // })
    clonedModel?.remove(shellModel!)
  }
  
  // // 地面和风机骨架消隐藏
  // const groundAndSkeletonHideAnimation = () => {
  //   const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 3.5)
  //   modelSkeleton.current?.traverse((mesh) => {
  //     if (!(mesh instanceof THREE.Mesh)) return undefined
  //     mesh.material.clippingPlanes = [clippingPlane]
  //     return undefined
  //   })
  //   const uid = uuid()
  //   renderMixins.set(uid, () => {
  //     if (clippingPlane.constant <= -0.1) renderMixins.delete(uid)
  //     clippingPlane.constant -= 0.04
  //   })
  //   console.log(renderMixins)
  // }
  // // 地面和风机骨架显示
  // const groundAndSkeletonShowAnimation = () => {
  //   const clippingPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -0.1)
  //   modelSkeleton.current?.traverse((mesh) => {
  //     if (!(mesh instanceof THREE.Mesh)) return undefined
  //     mesh.material.clippingPlanes = [clippingPlane]
  //     return undefined
  //   })
  //   const uid = uuid()
  //   renderMixins.set(uid, () => {
  //     if (clippingPlane.constant >= 3.5) renderMixins.delete(uid)
  //     clippingPlane.constant += 0.04
  //   })
  // }

  // 设备分解动画
  const equipmentDecomposeAnimation = () => {
    // groundAndSkeletonHideAnimation()
    modelEquipment.current?.updateMatrixWorld()
    modelEquipment.current?.children.forEach((child: THREE.Object3D) => {
      const params = MODEL_EQUIPMENT_POSITION_PARAMS_ENUM[child.name]
      gsap.to(child.position, {...params.DECOMPOSE, duration: 1});
    })
  }

  // 设备合成动画
  const equipmentComposeAnimation = () => {
    // groundAndSkeletonShowAnimation()
    modelEquipment.current?.children.forEach((child: THREE.Object3D) => {
      const params = MODEL_EQUIPMENT_POSITION_PARAMS_ENUM[child.name]
      gsap.to(child.position, {...params.COMPOSE, duration: 1});
    })
  }

  

  // 风机设备点击事件
  const onEquipmentClick = () => {
    const equipmentList: any = []
    modelEquipment.current?.traverse((mesh) => {
      if (!(mesh instanceof THREE.Mesh)) return undefined
      const { material } = mesh
      mesh.material = material.clone()
      equipmentList.push(mesh)
      return undefined
    })
    const handler = (event: MouseEvent) => {
      if (!container.current) return;
      const el = container.current as HTMLElement
      const mouse = new THREE.Vector2(
        (event.clientX / el.offsetWidth) * 2 - 1,
        -(event.clientY / el.offsetHeight) * 2 + 1
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera.current!)
      const intersects = raycaster.intersectObject(modelEquipment.current!, true)
      if (size(intersects) <= 0) return undefined
      const equipment = <any>intersects[0].object
      if (!equipment) return undefined
      equipmentList.forEach((child: any) => {
        child.material.emissive.setHex(child.currentHex)
      })
      equipment.currentHex =
        equipment.currentHex ?? equipment.material.emissive.getHex()
      equipment.material.emissive.setHex(0xff0000)
      return undefined
    }
    document.addEventListener('click', handler)
    clickEventRef.current = handler
  }

  const loadModels = async (tasks: Promise<any>[]) => {
    setLoading(true)
    await Promise.all(tasks)
    setLoading(false)
  }

  useEffect(() => {
    loadModels([
      loadTurbineSkeleton(),
      loadTurbineEquipments(),
    ]).then(()=> {
      loadLights()
      loadBG()
      scene.current?.add(turbine)
      // 当全部模型加载时完毕触发
      onEquipmentClick()
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
        document.removeEventListener('click', clickEventRef.current)
      }
    };
  }, [])

  return {
    container,
    loading,
    turbine,
    equipmentDecomposeAnimation,
    equipmentComposeAnimation,
  }
}

export default useTurbine
