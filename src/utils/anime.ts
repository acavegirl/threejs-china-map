import * as THREE from "three";
import gsap from "gsap";

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
    if (mesh._s <= 2) {
      mesh.material.opacity = 2 - mesh._s;
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