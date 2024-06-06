import * as THREE from "three";
import gsap from "gsap";
import { mapConfig } from "../configs/chinaMap";

/**
 * 动态地图缩放大小
 */
function getDynamicMapScale(
  mapObject3D: THREE.Object3D,
  containerRef: HTMLElement
) {
  // const width = containerRef.offsetWidth;
  // const height = containerRef.offsetHeight;
  const width = containerRef.clientWidth;
  const height = containerRef.clientHeight;
  const refArea = width * height;

  const boundingBox = new THREE.Box3().setFromObject(mapObject3D);
  // 获取包围盒的尺寸
  const size = new THREE.Vector3();
  boundingBox.getSize(size);
  // 新增 Math.random避免缩放为1，没有动画效果
  const scale =
    Math.round(Math.sqrt(refArea / (size.x * size.y * 400))) +
    parseFloat((Math.random() + 0.5).toFixed(2));
  return scale;
}

/**
 * 初次加载时按比例放大地图
 * @param mapObject
 * @param containerRef
 */
export const zoomMap = (mapObject3D: THREE.Object3D, containerRef: HTMLElement) => {
  const mapScale = getDynamicMapScale(mapObject3D, containerRef)
  gsap.to(mapObject3D.scale, { x: mapScale, y: mapScale, z: 1, duration: 1 });
}

/**
 * 圆环动画
 * @param spotList 
 */
export const spotAnime = (spotList: any) => {
  spotList.forEach((mesh: any) => {
    mesh._s += 0.01;
    mesh.scale.set(1 * mesh._s, 1 * mesh._s, 1 * mesh._s);
    if (mesh._s <= 1.6) {
      mesh.material.opacity = 1.6 - mesh._s;
    } else {
      mesh._s = 1;
    }
  });
}

/**
 * 加载的模型动画
 * @param clock 
 * @param modelMixer 
 */
export const modelAnime = (clock: THREE.Clock, modelMixer: THREE.AnimationMixer[]) => {
  const delta = clock.getDelta();
  modelMixer.map((item: any) => item.update(delta));
}

/**
 * 飞行线动画
 * @param flySpotList 
 */
export const flyAnime = (flySpotList: THREE.Mesh[]) => {
  // 飞行的圆点
  flySpotList.forEach(function (mesh: any) {
    mesh._s += 0.003;
    let tankPosition = new THREE.Vector3();
    // getPointAt() 根据弧长在曲线上的位置。必须在范围[0，1]内。
    tankPosition = mesh.curve.getPointAt(mesh._s % 1);
    mesh.position.set(tankPosition.x, tankPosition.y, tankPosition.z);
  });
}

let timestamp = 0
let colorIndex = 0
export const flyTrailAnime = (flyLineList: any) => {
  let now = Date.now()
  if (now - timestamp > mapConfig.fly.timeDelta) {
    timestamp = now
    colorIndex++
    if (colorIndex >= flyLineList[0].geometry.getAttribute('color').count) {
      colorIndex = 0
    }
  }
  flyLineList.forEach((flyLine: any)=> {
    let color = flyLine.geometry.getAttribute('color')
    for(let i = 0; i < color.array.length; i += 4) {
      if ((i / 4) === colorIndex) {
        color.array[i + 3] = 1
      } else if ((i / 4) === colorIndex-1) {
        color.array[i + 3] = 0.7
      } else if ((i / 4) === colorIndex-2) {
        color.array[i + 3] = 0.4
      }else {
        color.array[i + 3] = 0
      }
    }

    flyLine.geometry.attributes.color.needsUpdate = true // 更新颜色
  })
}

export const planeAnime = (texture: any) => {
  if (!texture) return;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  const count = texture.repeat.y;
  if (count <= 10) {
    texture.repeat.x += 0.1;
    texture.repeat.y += 0.2;
  } else {
    texture.repeat.x = 0;
    texture.repeat.y = 0;
  }
}