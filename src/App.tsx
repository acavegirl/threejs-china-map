import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ChinaMap from "@/components/ChinaMap";
import { GeoJsonType } from "@/types/geojson";
import type { ProjectionFnParamType } from "@/types/chinaMap";

export default () => {
  const [geoJson, setGeoJson] = useState<GeoJsonType>();
  const [borderGeoJson, setBorderGeoJson] = useState<GeoJsonType>();
  const [mapAdCode, setMapAdCode] = useState<number>(100000);
  // 地图中心和缩放比例，用于进行坐标投影
  const [projectionFnParam, setProjectionFnParam] =
    useState<ProjectionFnParamType>({
      center: [104.0, 37.5],
      scale: 30,
    });

  useEffect(() => {
    queryMapData(mapAdCode); // 默认的中国adcode码
  }, [mapAdCode]);

  // 请求地图数据
  const queryMapData = useCallback(async (code: number) => {
    const response = await axios.get(
      `https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json`
    );
    const { data } = response;

    const borderResponse = await axios.get(
      `https://geo.datav.aliyun.com/areas_v3/bound/100000.json`
    );
    const { data: borderData } = borderResponse;
    setGeoJson(data);
    setBorderGeoJson(borderData);
  }, []);

  return (
    <>
      {geoJson && borderGeoJson && (
        <ChinaMap
          borderGeoJson={borderGeoJson}
          geoJson={geoJson}
          projectionFnParam={projectionFnParam}
        />
      )}
    </>
  );
}
