import * as THREE from 'three';

/**
 * LLA 转 ECEF，参数都是弧度
 * @param lat 
 * @param lon 
 * @param alt 
 * @param rad 
 * @returns 
 */
export const llaToEcef = (lat: number, lon: number, alt: number, rad: number) => {
	let f = 0
	let ls = Math.atan((1 - f) ** 2 * Math.tan(lat))
	let x = rad * Math.cos(ls) * Math.cos(lon) + alt * Math.cos(lat) * Math.cos(lon)
	let y = rad * Math.cos(ls) * Math.sin(lon) + alt * Math.cos(lat) * Math.sin(lon)
	let z = rad * Math.sin(ls) + alt * Math.sin(lat)
	return new THREE.Vector3(x, y, z)
}

// 经纬度转弧度
export const lonLauToRadian = (lon: number, lat: number, rad: number) => {
	return llaToEcef(Math.PI * (0 - lat) / 180, Math.PI * (lon / 180), 1, rad)
}

