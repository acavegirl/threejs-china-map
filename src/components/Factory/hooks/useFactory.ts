import * as THREE from 'three'
import { useThree, usePageChange } from '@/hooks'
import { initAmbientLight, initDirectionalLight } from '@/utils/light'
import { LightData, PosV3 } from '@/types/data'
import { useEffect, useRef } from 'react'
import { v4 as uuid } from 'uuid'
import { size } from 'lodash'
import { drawPlaneModel, generateParticlesBG } from '@/utils/drawMap'
import { planeAnime } from '@/utils/anime'

export function useFactory() {
  const setPageChange = usePageChange()
  const factoryModelRef = useRef<any>()

  const {
    container,
    scene,
    camera,
    renderer,
    control,
    loadGLTF,
    renderMixins,
    render,
    addBoxHelper,
    setBoxHelperObj,
    setBoxHelperVisibility,
    loadModels,
  } = useThree([0, -90, 10])

  const onResizeEventRef = useRef<any>()
  const clickEventRef = useRef<any>()
  const mouseMoveEventRef = useRef<any>()

  // 加载灯光
  const loadLights = () => {
    const light = initAmbientLight(4)
    scene.current?.add(light)

    const lightData: LightData = [
      [[0, 0, 50], 3],
    ]
    lightData.map((data: [PosV3, number]) => {
      const light = initDirectionalLight(...data)
      scene.current?.add(light)
      // const lightHelper = initDirectionalLightHelper(light)
      // scene.current?.add(lightHelper);
    })
  }

  const loadBG = async () => {
    const { scene: clonedModel } = await loadGLTF(`${process.env.PUBLIC_URL}/models/plane.glb`)
    const { modelObject3D, planeTexture} = drawPlaneModel(clonedModel)
    scene.current?.add(modelObject3D)
    const uid = uuid()
    renderMixins.set(uid, () => {
      planeAnime(planeTexture)
    })
  }

  const loadFactory = async () => {
    const { scene: clonedModel } = await loadGLTF(`${process.env.PUBLIC_URL}/models/datacenter.glb`)
    // 设置模型大小
    clonedModel.scale.set(2.5, 2.5, 2.5);
    clonedModel.rotateX(Math.PI / 2);
    clonedModel.rotateY(Math.PI*1.5);
    clonedModel.name = 'factory'
    // 在模型上挂载数据
    clonedModel.userData = {id: `factory`}
    const rackList: any[] = [];
    clonedModel.traverse(item => {
      if (item.name.includes('rack')) {
        rackList.push(item);
      }
    });
    factoryModelRef.current = rackList
    scene.current?.add(clonedModel)
  }

  // 点击事件
  const onFactoryClick = () => {
    const handler = (event: MouseEvent) => {
      if (!container.current) return;
      const el = container.current as HTMLElement
      const mouse = new THREE.Vector2(
        (event.clientX / el.offsetWidth) * 2 - 1,
        -(event.clientY / el.offsetHeight) * 2 + 1
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera.current!)
      const intersects = raycaster.intersectObjects(factoryModelRef.current, true)
      if (size(intersects) <= 0) return undefined
      const factory = <any>intersects[0].object
      if (!factory) return undefined
      setPageChange({
        id: factory.parent.parent.userData,
        type: 'device',
      })
      return undefined
    }
    const mouseMoveHandler = (event: MouseEvent) => {
      if (!container.current) return;
      const el = container.current as HTMLElement
      const mouse = new THREE.Vector2(
        (event.clientX / el.offsetWidth) * 2 - 1,
        -(event.clientY / el.offsetHeight) * 2 + 1
      )
      const raycaster = new THREE.Raycaster()
      raycaster.setFromCamera(mouse, camera.current!)
      const intersects = raycaster.intersectObjects(factoryModelRef.current, true)
      if (size(intersects) <= 0) {
        setBoxHelperVisibility(false)
        return
      }
      const factory = <any>intersects[0].object
      if (!factory) {
        setBoxHelperVisibility(false)
        return 
      }
      const getParentModel: any = (obj: THREE.Object3D)=> {
        if (obj.name.includes('rack')) {
          return obj
        }
        if (obj.parent) {
          return getParentModel(obj.parent)
        }
        return new THREE.Object3D()
      }
      const parentModel = getParentModel(factory)
      console.log(parentModel, 'parent')
      setBoxHelperObj(parentModel as THREE.Object3D)
      return undefined
    }
    document.addEventListener('dblclick', handler)
    document.addEventListener('mousemove', mouseMoveHandler)
    clickEventRef.current = handler
    mouseMoveEventRef.current = mouseMoveHandler
  }

  useEffect(() => {
    loadModels([
      loadBG(),
      loadFactory(),
    ]).then(()=> {
      loadLights()
      addBoxHelper()
      // 当全部模型加载时完毕触发
      onFactoryClick()
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
        document.removeEventListener('mousemove', mouseMoveEventRef.current)
      }
    };
  }, [])

  return {
    container
  }
}

export default useFactory
