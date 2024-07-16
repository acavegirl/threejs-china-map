import { PosV3 } from "@/types/data";
import * as THREE from "three";

export function initLight() {
  const light = new THREE.DirectionalLight(0xffffff, 4.5);
  light.position.set(0, -60, 30);
  return light;
}

export function initDirectionalLight(position: PosV3, intensity: number) {
  const light = new THREE.DirectionalLight(0xffffff, intensity);
  light.position.set(...position);
  return light;
}

export function initAmbientLight(intensity: number) {
  const light = new THREE.AmbientLight(0xffffff, intensity);
  return light;
}

export function initPointLight(position: PosV3, intensity: number) {
  const light = new THREE.PointLight(0xffffff, intensity);
  light.position.set(...position);
  return light;
}