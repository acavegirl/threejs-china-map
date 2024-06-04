import { LinearTransfer } from "three";

// 场景配置
export const sceneConfig = {
  // backgroundColor: "#06092A",
  backgroundColor: "#222831",
}

// 3d 地图配置
const BGDepth = 0.2;
const BorderDepth = 1.8;
const Depth = BGDepth + BorderDepth;
export const mapConfig = {
  bg: {
    mapDepth: BGDepth,
    mapTransparent: false,
    mapOpacity: 0.9,
    // mapColor: "#132354", // 地图原本颜色
    mapColor: '#022C43',
    // 地图侧面渐变
    mapSideColor1: "#1C1678",
    mapSideColor2: "#42A0F9",
    topLineColor: '#8c8c8c',
    topLineWidth: 1,
    topLineZIndex: BGDepth + 0.5,
  },
  border: {
    // 地图挤出厚度
    mapDepth: BorderDepth,
    // 地图透明度
    mapTransparent: true,
    mapOpacity: 0.2,
    // 地图颜色
    mapColor: "#8c8c8c", // 地图原本颜色
    mapHoverColor: "#409EF9", // 地图hover颜色
    // 地图人数渐变
    mapColorGradient: ["#42A0F9", "#1E6BF8", "#0B388A", "#132354"],
    // 地图侧面渐变
    mapSideColor1: "#0E2954",
    mapSideColor2: "#022C43",
    // 上面的line
    // topLineColor: 0x41c0fb,
    topLineColor: '#bae0ff',
    topLineWidth: 2,
    topLineZIndex: BorderDepth + 0.4,
  },
  // 地图透明度
  mapTransparent: false,
  mapOpacity: 0.9,
  // label 2d高度
  label2dZIndex: Depth + 2,
  // spot
  spotZIndex: BorderDepth + 1,

  // spotColor: '#69b1ff',
  // ringColor: '#8c8c8c',
  // 圆点color
  spotColor: '#022C43',
  // 圆环颜色
  ringColor: 0x10E6DF,

  // 边框
  outlinePass: {
    renderToScreen: true,
    edgeGlow: 0.3, // 发光强度
    usePatternTexture: false, // 是否使用纹理图案
    edgeThickness: 16, // 边缘浓度
    edgeStrength: 5, // 边缘的强度，值越高边框范围越大
    pulsePeriod: 0,// 闪烁频率，值越大频率越低
    visibleEdgeColor: '#bae0ff', // 呼吸显示的颜色
    hiddenEdgeColor: '#022C43',
  },
  flyStyle: 'TRAIL', // SPOT | TRAIL
  // 飞行线
  fly: {
    spotColor: '#fff',
    lineColor: '#F9F9E0',
    lineTransparent: true,
    lineOpacity: 0.3,
    timeDelta: 60,
  }
};

// 粒子背景
export const particlesBGConfig = {
  // 粒子之间间距
  separation: 5,
  // 水平方向粒子数
  amountX: 50,
  // 垂直方向粒子数
  amountY: 50,
  color: '#76ABAE'
}