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
  const label2dData: any = []; // 存储自定义 2d 标签数据

  // 地图中心和缩放比例
  const { center, scale } = projectionFnParam;
  const projectionFn = d3
    .geoMercator()
    .center(center)
    .scale(scale)
    .translate([0, 0]);

  // 背景
  const bgMapObject3D = new THREE.Object3D();
  // 地图数据
  const { features: basicFeatures } = geojsonData;

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
    const featureCenterCoord: any =
      basicFeatureItem.properties.centroid &&
      projectionFn(basicFeatureItem.properties.centroid);
    // 名字
    const featureName: string = basicFeatureItem.properties.name;

    if (featureCenterCoord) {
      label2dData.push({
        featureCenterCoord,
        featureName,
      });
    }

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
  mapObject3D.position.z = 1
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


// 绘制挤出的材质
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

/**
 * model生成的点
 * @param glb 
 * @param label2dData 
 * @returns 
 */
export const drawPointModel = (glb: GLTF, label2dData: any) => {
  // 多个点的model
  const modelObject3D = new THREE.Object3D();
  // 多个动画mixer
  let modelMixer: any = [];

  label2dData.forEach((item: any) => {
    const { featureCenterCoord } = item;
    const clonedModel = glb.scene.clone();
    const mixer = new THREE.AnimationMixer(clonedModel);
    const clonedAnimations = glb.animations.map((clip) => {
      return clip.clone();
    });
    clonedAnimations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });

    // 添加每个model的mixer
    modelMixer.push(mixer);

    // 设置模型位置
    clonedModel.position.set(
      featureCenterCoord[0],
      -featureCenterCoord[1],
      mapConfig.spotZIndex
    );
    // 设置模型大小
    clonedModel.scale.set(0.3, 0.3, 0.8);
    // clonedModel.rotateX(-Math.PI / 8);
    modelObject3D.add(clonedModel);
  });

  return { modelObject3D, modelMixer}
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
    // 创建点,并加入场景
    const particles = new THREE.Points(particlesGeometry, material);

    return particles
}