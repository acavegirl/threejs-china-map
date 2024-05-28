// 场景配置
export const sceneConfig = {
  backgroundColor: "#06092A"
}

// 3d 地图配置
const Depth = 1.2;
export const mapConfig = {
  // 地图挤出厚度
  mapDepth: Depth,
  // 地图透明度
  mapTransparent: false,
  mapOpacity: 0.6,
  // 地图颜色
  mapColor: "#06092A", // 地图原本颜色
  mapHoverColor: "#409EF9", // 地图hover颜色
  // mapColor: "#06092A", // 地图原本颜色
  // mapHoverColor: "#409EF9", // 地图hover颜色
  // 地图人数渐变
  mapColorGradient: ["#42A0F9", "#1E6BF8", "#0B388A", "#132354"],
  // 地图侧面渐变
  mapSideColor1: "#1C1678",
  mapSideColor2: "#000",
  // mapSideColor1: "#42A0F9",
  // mapSideColor2: "#000",
  // 上面的line
  // topLineColor: 0x41c0fb,
  topLineColor: 0x41c0fb,
  topLineWidth: 1.3,
  topLineZIndex: Depth + 0.5,
  // label 2d高度
  label2dZIndex: Depth + 2,
  // spot
  spotZIndex: Depth + 0.2,

  // 圆点color
  spotColor: 0x10E6DF,
  // 圆环颜色
  ringColor: 0x10E6DF,

  // 边框
  outlinePass: {
    renderToScreen: true,
    edgeGlow: 0.6, // 发光强度
    usePatternTexture: false, // 是否使用纹理图案
    edgeThickness: 10, // 边缘浓度
    edgeStrength: 4, // 边缘的强度，值越高边框范围越大
    pulsePeriod: 0,// 闪烁频率，值越大频率越低
    visibleEdgeColor: 0x41c0fb // 呼吸显示的颜色
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
  color: 0x10E6DF
}