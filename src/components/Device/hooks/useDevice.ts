import * as THREE from 'three'
import { useThree, usePageChange } from '@/hooks'
import { initAmbientLight, initDirectionalLight } from '@/utils/light'
import { LightData, PosV3 } from '@/types/data'
import { useEffect, useRef } from 'react'
import { size } from 'lodash'
import { Reflector } from 'three/examples/jsm/objects/Reflector';
// import MeshReflectorMaterial from '@/assets/js/MeshReflectorMaterial.js';

export function useDevice() {
  const deviceModelRef = useRef(new THREE.Object3D())

  const {
    container,
    scene,
    camera,
    renderer,
    loadGLTF,
    renderMixins,
    render,
    loadModels,
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
      // const lightHelper = initDirectionalLightHelper(light)
      // scene.current?.add(lightHelper);
    })
  }

  const loadBG = async () => {
    // const { scene: clonedModel } = await loadGLTF(`${process.env.PUBLIC_URL}/models/plane.glb`)
    // const { modelObject3D, planeTexture} = drawPlaneModel(clonedModel)
    // scene.current?.add(modelObject3D)
    // const uid = uuid()
    // renderMixins.set(uid, () => {
    //   planeAnime(planeTexture)
    // })

    let options = {
      clipBias: 0.03, // 鏡射多遠的距離
      textureWidth: 1024, // 鏡射材質圖解析度
      textureHeight: 1024, // 鏡射材質圖解析度
      color: 0x889999, // 反射光的濾鏡
      recursion: 0 // 反射可以反彈幾次
    };
    const geometry = new THREE.PlaneGeometry(100, 100, 1, 1)
    // 放到Reflector參數中。
    let mirror = new Reflector(geometry, options)
    scene.current?.add(mirror);

    // let fadingReflectorOptions = {
    //   mixBlur: 2,
    //   mixStrength: 1.5,
    //   resolution: 2048, // 材質圖的解析度
    //   blur: [0, 0], // 高斯模糊的材質解析度為何
    //   minDepthThreshold: 0.7,// 從多遠的地方開始淡出
    //   maxDepthThreshold: 2, // 到多遠的地方會淡出到沒畫面
    //   depthScale: 2,
    //   depthToBlurRatioBias: 2,
    //   mirror: 0,
    //   distortion: 2,
    //   mixContrast: 2,
    //   reflectorOffset: 0, // 鏡面跟物理中間是否要留一段距離才開始反射
    //   bufferSamples: 8,
    // }
    // // 透過geometry以及material來建立Mesh物件
    // const geometry = new THREE.PlaneGeometry(100, 100, 1, 1)
    // const material = new THREE.MeshBasicMaterial()
    // const mesh = new THREE.Mesh(geometry, (material as any))
    // // 將材質置換成MeshReflectorMaterial
    // mesh.material = new MeshReflectorMaterial(renderer, camera, scene, mesh, (fadingReflectorOptions as any));
    // scene.current?.add(mesh);
    // const uid = uuid()
    // renderMixins.set(uid, () => {
    //   (mesh.material as any).update()
    // })
  }

  const loadDevice = async () => {
    const { scene: clonedModel } = await loadGLTF(`${process.env.PUBLIC_URL}/models/device.glb`)
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


  useEffect(() => {
    loadModels([
      loadDevice(),
    ]).then(()=> {
      // 当全部模型加载时完毕触发
      loadBG()
      loadLights()
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
