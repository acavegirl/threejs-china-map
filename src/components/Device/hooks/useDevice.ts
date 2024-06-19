import * as THREE from 'three'
import { useThree } from '@/hooks'
import { initAmbientLight, initDirectionalLight } from '@/utils/light'
import { LightData, PosV3 } from '@/types/data'
import { useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import { size } from 'lodash'
import gsap from "gsap";
import { drawPlaneModel } from '@/utils/drawMap'
import { initDirectionalLightHelper } from '@/utils/helper'
import { planeAnime } from '@/utils/anime'
import { useLayerStore } from "@/store/layer";

export function useDevice() {
  const { setLayerInfo } = useLayerStore((state) => ({
    setLayerInfo: state.setLayerInfo
  }))
  const deviceModelRef = useRef(new THREE.Object3D())

  const {
    container,
    scene,
    camera,
    renderer,
    control,
    loadGLTF,
    renderMixins,
    render,
  } = useThree([0, -90, 50])

  const onResizeEventRef = useRef<any>()
  const clickEventRef = useRef<any>()

  // 加载灯光
  const loadLights = () => {
    const light = initAmbientLight(4)
    scene.current?.add(light)

    const lightData: LightData = [
      [[0, 40, 6], 3],
      [[-30, -80, 6], 10],
      // [[0, 0, 10], 3],
    ]
    lightData.map((data: [PosV3, number]) => {
      const light = initDirectionalLight(...data)
      scene.current?.add(light)
      const lightHelper = initDirectionalLightHelper(light)
      scene.current?.add(lightHelper);
    })
  }

  const loadBG = async () => {
    const { scene: clonedModel } = await loadGLTF("/models/plane.glb")
    const { modelObject3D, planeTexture} = drawPlaneModel(clonedModel)
    scene.current?.add(modelObject3D)
    const uid = uuid()
    renderMixins.set(uid, () => {
      planeAnime(planeTexture)
    })
  }

  const loadDevice = async () => {
    const { scene: clonedModel } = await loadGLTF("/models/device.glb")
    // 设置模型大小
    clonedModel.scale.set(30, 30, 30);
    clonedModel.rotateX(Math.PI / 2);
    // clonedModel.rotateY(Math.PI / 2);
    // clonedModel.position.x = -10
    clonedModel.name = 'device'
    // 在模型上挂载数据
    clonedModel.userData = {id: `device`}
    // clonedModel.traverse((mesh) => {
    //   if (!(mesh instanceof THREE.Mesh)) return undefined
    //   mesh.material.transmission = 1
    //   console.log('mesh', mesh)
    // })
    console.log('clonedModel', clonedModel)
    deviceModelRef.current = clonedModel
    scene.current?.add(deviceModelRef.current)
  }

  // 点击事件
  const onDeviceClick = () => {
    const handler = (event: MouseEvent) => {
      if (!container.current) return;
      const el = container.current as HTMLElement
      const mouse = new THREE.Vector2(
        (event.clientX / el.offsetWidth) * 2 - 1,
        -(event.clientY / el.offsetHeight) * 2 + 1
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera.current!)
      const intersects = raycaster.intersectObject(deviceModelRef.current, true)
      if (size(intersects) <= 0) return undefined
      const device = <any>intersects[0].object
      if (!device) return undefined
      console.log('device', device.parent.parent.userData)
      return undefined
    }
    document.addEventListener('dblclick', handler)
    clickEventRef.current = handler
  }

  const loadModels = async (tasks: Promise<any>[]) => {
    await Promise.all(tasks)
  }

  useEffect(() => {
    loadBG()
    loadLights()
    loadModels([
      loadDevice(),
    ]).then(()=> {
      // 当全部模型加载时完毕触发
      onDeviceClick()
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
  }, [])

  return {
    container
  }
}

export default useDevice
