import * as THREE from "three";

export function initLight() {
  const light = new THREE.AmbientLight( 0xffffff );
  return light;
}
