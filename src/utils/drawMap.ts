import * as THREE from "three";
import * as d3 from "d3";
import { Line2 } from "three/examples/jsm/lines/Line2";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial";
import {
  GeoJsonType,
  GeoJsonFeature,
  GeometryCoordinates,
  GeometryType,
  ExtendObject3D,
} from "@/types/geojson";
import type { ProjectionFnParamType } from "@/types/chinaMap"
import { mapConfig, particlesBGConfig } from '@/configs/chinaMap';
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer";
export type XYCoordType = [number, number]

interface Label2dDataType {
  featureCenterCoord: XYCoordType; // 坐标系坐标
  featureName: string;
}

/**
 * 生成地图3D模型
 * @param geojsonData 
 * @param projectionFnParam 
 * @returns 
 */
export function generateMapObject3D(
  geojsonData: GeoJsonType,
  borderGeoJson: GeoJsonType,
  projectionFnParam: ProjectionFnParamType,
){
  // 地图对象
  const mapObject3D = new THREE.Object3D();
  // const label2dData: Label2dDataType[] = []; // 存储自定义 2d 标签数据

  // 地图中心和缩放比例
  const { center, scale } = projectionFnParam;
  const projectionFn = d3
    .geoMercator()
    .center(center)
    .scale(scale)
    .translate([0, 0]);

  // console.log(projectionFn())

  // 背景
  const bgMapObject3D = new THREE.Object3D();
  // 地图数据
  const { features: basicFeatures } = geojsonData;

  const pointData: Label2dDataType[] = [{
    featureCenterCoord: [121.4737, 31.2304],
    featureName: '上海',
  }, {
    featureCenterCoord: [120.5832, 31.2983],
    featureName: '苏州',
  }]
  const label2dData = pointData.map(item => ({
    featureCenterCoord: projectionFn(item.featureCenterCoord),
    featureName: item.featureName,
  }))


    // 每个省的数据
  basicFeatures.forEach((basicFeatureItem: GeoJsonFeature) => {
    // 每个省份的地图对象
    const provinceMapObject3D = new THREE.Object3D() as ExtendObject3D;
    // 将地图数据挂在到模型数据上
    provinceMapObject3D.customProperties = basicFeatureItem.properties;

    // 每个坐标类型
    const featureType = basicFeatureItem.geometry.type;
    // 每个坐标数组
    const featureCoords: GeometryCoordinates<GeometryType> =
      basicFeatureItem.geometry.coordinates;
    // 每个中心点位置
    // const featureCenterCoord: any =
    //   basicFeatureItem.properties.centroid &&
    //   projectionFn(basicFeatureItem.properties.centroid);
    // 名字
    // const featureName: string = basicFeatureItem.properties.name;

    // if (featureCenterCoord) {
    //   label2dData.push({
    //     featureCenterCoord,
    //     featureName,
    //   });
    // }

    // MultiPolygon 类型
    if (featureType === "MultiPolygon") {
      featureCoords.forEach((multiPolygon: [number, number][][]) => {
        multiPolygon.forEach((polygon: [number, number][]) => {
          const { mesh, line } = drawExtrudeMesh(polygon, projectionFn, mapConfig.bg);
          provinceMapObject3D.add(mesh);
          provinceMapObject3D.add(line);
        });
      });
    }

    // Polygon 类型
    if (featureType === "Polygon") {
      featureCoords.forEach((polygon: [number, number][]) => {
        const { mesh, line } = drawExtrudeMesh(polygon, projectionFn, mapConfig.bg);
        provinceMapObject3D.add(mesh);
        provinceMapObject3D.add(line);
      });
    }

    bgMapObject3D.add(provinceMapObject3D);
  });



  // 地图对象
  const borderMapObject3D = new THREE.Object3D();
  const { features: borderFeatures } = borderGeoJson;
  const { geometry: borderGeo } = borderFeatures[0]

  borderGeo.coordinates.forEach((multiPolygon: [number, number][][]) => {
    multiPolygon.forEach((polygon: [number, number][]) => {
      const { mesh, line } = drawExtrudeMeshBorder(polygon, projectionFn, mapConfig.border);
      borderMapObject3D.add(mesh);
      borderMapObject3D.add(line);
    });
  });
  mapObject3D.add(borderMapObject3D);
  mapObject3D.add(bgMapObject3D)
  mapObject3D.position.z = mapConfig.mapZ
  return { mapObject3D, label2dData, bgMapObject3D, borderMapObject3D }
}


// 绘制挤出的材质
function drawExtrudeMesh(
  point: [number, number][],
  projectionFn: any,
  mapConfig: any,
): any {
  const shape = new THREE.Shape();
  const pointsArray = [];

  for (let i = 0; i < point.length; i++) {
    const [x, y]: any = projectionFn(point[i]); // 将每一个经纬度转化为坐标点
    if (i === 0) {
      shape.moveTo(x, -y);
    }
    shape.lineTo(x, -y);
    pointsArray.push(x, -y, mapConfig.topLineZIndex);
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: mapConfig.mapDepth, // 挤出的形状深度
    bevelEnabled: false, // 对挤出的形状应用是否斜角
  });

  const material = new THREE.MeshPhongMaterial({
    color: mapConfig.mapColor,
    transparent: mapConfig.mapTransparent,
    opacity: mapConfig.mapOpacity,
  });

  const materialSide = new THREE.ShaderMaterial({
    uniforms: {
      color1: {
        value: new THREE.Color(mapConfig.mapSideColor1),
      },
      color2: {
        value: new THREE.Color(mapConfig.mapSideColor2),
      },
    },
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec3 vPosition;
      void main() {
        vec3 mixColor = mix(color1, color2, 0.5 - vPosition.z * 0.2); // 使用顶点坐标 z 分量来控制混合
        gl_FragColor = vec4(mixColor, 1.0);
      }
    `,
    //   wireframe: true,
  });

  const mesh: any = new THREE.Mesh(geometry, [material, materialSide]);
  // userData 存储自定义属性
  mesh.userData = {
    isChangeColor: true,
  };

  // 边框线，赋值空间点坐标，3个一组
  const lineGeometry = new LineGeometry();
  lineGeometry.setPositions(pointsArray);

  const lineMaterial = new LineMaterial({
    color: mapConfig.topLineColor,
    linewidth: mapConfig.topLineWidth,
  });
  lineMaterial.resolution.set(window.innerWidth, window.innerHeight);
  const line = new Line2(lineGeometry, lineMaterial);

  return { mesh, line };
}


// 绘制挤出的材质，边框透明层
function drawExtrudeMeshBorder(
  point: [number, number][],
  projectionFn: any,
  mapConfig: any,
): any {
  const shape = new THREE.Shape();
  const pointsArray = [];

  for (let i = 0; i < point.length; i++) {
    const [x, y]: any = projectionFn(point[i]); // 将每一个经纬度转化为坐标点
    if (i === 0) {
      shape.moveTo(x, -y);
    }
    shape.lineTo(x, -y);
    pointsArray.push(x, -y, mapConfig.topLineZIndex);
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: mapConfig.mapDepth, // 挤出的形状深度
    bevelEnabled: false, // 对挤出的形状应用是否斜角
  });

  const material = new THREE.MeshPhongMaterial({
    color: mapConfig.mapColor,
    transparent: mapConfig.mapTransparent,
    opacity: mapConfig.mapOpacity,
  });

  const materialSide = new THREE.ShaderMaterial({
    uniforms: {
      color1: {
        value: new THREE.Color(mapConfig.mapSideColor1),
      },
      color2: {
        value: new THREE.Color(mapConfig.mapSideColor2),
      },
    },
    vertexShader: `
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color1;
      uniform vec3 color2;
      varying vec3 vPosition;
      void main() {
        vec3 mixColor = mix(color1, color2, 0.5 - vPosition.z * 0.2); // 使用顶点坐标 z 分量来控制混合
        gl_FragColor = vec4(mixColor, 1.0);
      }
    `,
    //   wireframe: true,
  });

  const mesh: any = new THREE.Mesh(geometry, [material, materialSide]);
  // userData 存储自定义属性
  mesh.userData = {
    isChangeColor: true,
  };

  // 边框线，赋值空间点坐标，3个一组
  const lineGeometry = new LineGeometry();
  lineGeometry.setPositions(pointsArray);

  const lineMaterial = new LineMaterial({
    color: mapConfig.topLineColor,
    linewidth: mapConfig.topLineWidth,
    transparent: true,
    opacity: 0.3,
  });
  lineMaterial.resolution.set(window.innerWidth, window.innerHeight);
  const line = new Line2(lineGeometry, lineMaterial);

  return { mesh, line };
}


/**
 * 生成地图spot点位
 * @param label2dData 
 * @returns 
 */
export function generateMapSpot(label2dData: any) {
  const spotObject3D = new THREE.Object3D();
  const spotList: any = [];
  label2dData.forEach((item: any) => {
    const { featureCenterCoord } = item;
    const spotObjectItem = drawSpot(featureCenterCoord);
    if (spotObjectItem && spotObjectItem.circle && spotObjectItem.ring) {
      spotObject3D.add(spotObjectItem.circle);
      spotObject3D.add(spotObjectItem.ring);
      spotList.push(spotObjectItem.ring);
    }
  });
  return { spotObject3D, spotList };
}

/**
 * 绘制圆点
 * @param coord 坐标系坐标
 * @returns 
 */
const drawSpot = (coord: [number, number]) => {
  if (coord && coord.length) {
    /**
     * 绘制圆点
     */
    const spotGeometry = new THREE.CircleGeometry(0.2, 200);
    const spotMaterial = new THREE.MeshBasicMaterial({
      color: mapConfig.spotColor,
      side: THREE.DoubleSide,
    });
    const circle = new THREE.Mesh(spotGeometry, spotMaterial);
    circle.position.set(coord[0], -coord[1], mapConfig.spotZIndex);

    // 圆环
    const ringGeometry = new THREE.RingGeometry(0.2, 0.3, 50);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: mapConfig.ringColor,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(coord[0], -coord[1], mapConfig.spotZIndex);
    return { circle, ring };
  }
};


export const drawPlaneModel = (clonedModel: any) => {
  const modelObject3D = new THREE.Object3D();
  // const clonedModel = glb.scene.clone();
  clonedModel.scale.set(0.008, 0.008, 0.008)
  clonedModel.position.set(0, 0, 0);
  clonedModel.rotateX((Math.PI / 2))
  clonedModel.name = 'plane'
  clonedModel.renderOrder = 1

  clonedModel.traverse((model: any) => {
    if (model.isMesh) {
      model.frustumCulled = false;
      model.castShadow = true;
    }
  });
  const planeTexture = (clonedModel.children[0] as any).material.map;

  modelObject3D.add(clonedModel);
  return { modelObject3D, planeTexture}
}

/**
 * 粒子背景
 */
export const generateParticlesBG = () => {
  const particlesGeometry = new THREE.BufferGeometry()
  const numParticles = particlesBGConfig.amountX * particlesBGConfig.amountY;
  //用32位的浮点数组 创建顶点存储数组 一个顶点坐标由xyz,所以数组长度=粒子数*3
  const positions = new Float32Array(numParticles * 3);
  const scales = new Float32Array(numParticles);
  // 开始创建坐标点
  let i = 0,j = 0; 
  for (let ix = 0; ix < particlesBGConfig.amountX; ix++) {
    for (let iy = 0; iy < particlesBGConfig.amountY; iy++) {
      /*
        *   (SEPARATION 粒子间距，前面声明了，值150) 下面公式化简：
        *   分别对应（ x y z ）  =  (150x - 3750, 0 , 150y - 3750) ，解释如下
        *	 y轴不变，x z轴每150间距放置一个顶点，并偏移一半的总间距(3750)，
        *   使它们沿x z轴对称分布
        *
        */
      positions[i] = ix * particlesBGConfig.separation - ((particlesBGConfig.amountX * particlesBGConfig.separation) / 2); // x点
      positions[i + 1] = iy * particlesBGConfig.separation - ((particlesBGConfig.amountY * particlesBGConfig.separation) / 2); // y点
      positions[i + 2] = 0; // z点
      scales[j] = 1;
      // 每连续3个值，代表一个顶点
      i += 3;
      j++;
    }
  }
  particlesGeometry.setAttribute('position',new THREE.BufferAttribute(positions, 3))
  particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: {
        value: new THREE.Color(particlesBGConfig.color)
      },
    },
    vertexShader: `
      attribute float scale;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = scale * ( 300.0 / - mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      void main() {
        if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
        gl_FragColor = vec4( color, 1.0 );
      }
    `,
  });
  // 创建点
  const particles = new THREE.Points(particlesGeometry, material);

  return particles
}

export const generateStarBG = () => {
  const particlesGeometry = new THREE.BufferGeometry()
  const numParticles = particlesBGConfig.amountX * particlesBGConfig.separation * 4;
  //用32位的浮点数组 创建顶点存储数组 一个顶点坐标由xyz,所以数组长度=粒子数*3
  const positions = new Float32Array(numParticles * 3);
  const scales = new Float32Array(numParticles);

  const n = particlesBGConfig.amountX * particlesBGConfig.separation, n2 = n / 2; // triangles spread in the cube
  const d = 1,d2 = d / 2; // individual triangle size

  // 开始创建坐标点
  let i = 0,j = 0; 
  for (let ix = 0; ix < particlesBGConfig.amountX; ix++) {
    for (let iy = 0; iy < particlesBGConfig.amountY; iy++) {
      const x = Math.random() * n - n2;
      const y = Math.random() * n - n2;

      positions[i] = x + Math.random() * d - d2;
      positions[i + 1] = y + Math.random() * d - d2;
      positions[i + 2] = 0; // z点
      scales[j] = Math.random()*2.1;
      // 每连续3个值，代表一个顶点
      i += 3;
      j++;
    }
  }
  particlesGeometry.setAttribute('position',new THREE.BufferAttribute(positions, 3))
  particlesGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: {
        value: new THREE.Color(particlesBGConfig.color)
      },
    },
    vertexShader: `
      attribute float scale;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_PointSize = scale * ( 300.0 / - mvPosition.z );
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      void main() {
        if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;
        gl_FragColor = vec4( color, 1.0 );
      }
    `,
  });
  // 创建点
  const particles = new THREE.Points(particlesGeometry, material);

  return particles
}


/**
 * 线上移动物体
 */
const drawFlySpot = (curve: any) => {
  const aGeo = new THREE.SphereGeometry(0.3);
  const aMater = new THREE.MeshBasicMaterial({
    color: mapConfig.fly.spotColor,
    side: THREE.DoubleSide,
  });
  const aMesh: any = new THREE.Mesh(aGeo, aMater);
  // 保存曲线实例
  aMesh.curve = curve;
  aMesh._s = 0;
  return aMesh;
};

/**
 * 绘制两点之间连接的飞线
 * @param coordStart 
 * @param coordEnd 
 * @returns 
 */
const drawLineBetween2Spot = (
  coordStart: XYCoordType,
  coordEnd: XYCoordType
) => {
  const [x0, y0, z0] = [...coordStart, mapConfig.spotZIndex];
  const [x1, y1, z1] = [...coordEnd, mapConfig.spotZIndex];
  // 使用 QuadraticBezierCurve3 创建 三维二次贝塞尔曲线
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(x0, -y0, z0),
    new THREE.Vector3((x0 + x1) / 2, -(y0 + y1) / 2, 20),
    new THREE.Vector3(x1, -y1, z1)
  );

  const flySpot = drawFlySpot(curve);

  const lineGeometry = new THREE.BufferGeometry();
  // 获取曲线上50个点
  const points = curve.getPoints(300);
  const positions = [];
  for (let j = 0; j < points.length; j++) {
    positions.push(points[j].x, points[j].y, points[j].z);
  }
  // 放入顶点 和 设置顶点颜色
  lineGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(new Float32Array(positions), 3, true)
  );

  const material = new THREE.LineBasicMaterial({
    color: mapConfig.fly.lineColor,
    side: THREE.DoubleSide,
    transparent: mapConfig.fly.lineTransparent,
    opacity: mapConfig.fly.lineOpacity,
  });
  const flyLine = new THREE.Line(lineGeometry, material);

  return { flyLine, flySpot };
};

/**
 * 生成飞线
 * @param coordStart 
 * @param coordEnd 
 */
export const generateFlyLine = (connectLine: [XYCoordType, XYCoordType][]) => {
  const flyObject3D = new THREE.Object3D();
  const flySpotList: any = [];

  connectLine.forEach((item: any) => {
    const start = item[0]
    const end = item[1]
    const {flyLine: flyLineBG, curve} = createCurveLine([...start, mapConfig.spotZIndex], [...end, mapConfig.spotZIndex], 50, mapConfig.fly.lineColor, mapConfig.fly.lineOpacity)
    const flySpot = drawFlySpot(curve);

    flyObject3D.add(flyLineBG);
    flyObject3D.add(flySpot);
    flySpotList.push(flySpot);
  });
  return { flyObject3D, flySpotList }
}

export const generateFlyLineTrail = (connectLine: [XYCoordType, XYCoordType][]) => {
  const flyObject3D = new THREE.Object3D();
  const flySpotList: any = [];

  connectLine.forEach((item: any) => {
    const start = item[0]
    const end = item[1]

    const {flyLine} = createCurveLine([...start, mapConfig.spotZIndex], [...end, mapConfig.spotZIndex], 30, mapConfig.fly.spotColor, 1)
    const {flyLine: flyLineBG} = createCurveLine([...start, mapConfig.spotZIndex], [...end, mapConfig.spotZIndex], 300, mapConfig.fly.lineColor, mapConfig.fly.lineOpacity)
    flySpotList.push(flyLine)

    flyObject3D.add(flyLineBG);
    flyObject3D.add(flyLine);
  });
  return { flyObject3D, flySpotList }
}

/**
 * 创建一条曲线实体
 * @param start 开始坐标 [x, y, z]
 * @param end 结束坐标 [x, y, z]
 * @param pointNum 线上点的数量
 * @param color 线的颜色
 * @param opacity 线的透明度
 * @returns {Line, QuadraticBezierCurve3}
 */
const createCurveLine = (start: any, end: any, pointNum: number, color: any, opacity: number) => {
  const [x0, y0, z0] = [...start];
  const [x1, y1, z1] = [...end];
  // 使用 QuadraticBezierCurve3 创建 三维二次贝塞尔曲线
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(x0, -y0, z0),
    new THREE.Vector3((x0 + x1) / 2, -(y0 + y1) / 2, 20),
    new THREE.Vector3(x1, -y1, z1)
  );
  const points = curve.getPoints(pointNum);

  let colorHigh = new THREE.Color(color)
  let colors = new Float32Array(points.length * 4)
  // const positions:any = [];
  points.forEach((d, i) => {
    colors[i * 4] = colorHigh.r
    colors[i * 4 + 1] = colorHigh.g
    colors[i * 4 + 2] = colorHigh.b
    colors[i * 4 + 3] = opacity
    // positions.push(points[i].x, points[i].y, points[i].z);
  })

  
  
  // 创建几何体
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4))
  // 放入顶点 和 设置顶点颜色
  // geometry.setAttribute(
  //   "position",
  //   new THREE.BufferAttribute(new Float32Array(positions), 3, true)
  // );

  // 材质
  const material = new THREE.LineBasicMaterial({
    vertexColors: true, // 顶点着色
    transparent: true,
    side: THREE.DoubleSide
  })

  const flyLine = new THREE.Line(geometry, material)
  return { flyLine, curve }
}


/**
 * 隐藏CSS3D label
 * @param modelList 
 */
export const hideLabelModel = (modelList: any) => {
  // console.log('modelList', modelList)
  modelList?.traverse((item: any) => {
    if (!(item instanceof CSS3DSprite)) return;
    item.visible = false
  })
}