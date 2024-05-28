import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ChinaMap from "@/components/ChinaMap";
import { GeoJsonType } from "@/types/geojson";
import type { ProjectionFnParamType } from "@/types/chinaMap";

export default () => {
  const [geoJson, setGeoJson] = useState<GeoJsonType>();
  const [mapAdCode, setMapAdCode] = useState<number>(100000);
  const [projectionFnParam, setProjectionFnParam] =
    useState<ProjectionFnParamType>({
      center: [104.0, 37.5],
      scale: 40,
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
    setGeoJson(data);
  }, []);

  return (
    <>
      {geoJson && (
        <ChinaMap
          geoJson={geoJson}
          projectionFnParam={projectionFnParam}
        />
      )}
    </>
  );
}
