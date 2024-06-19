import { useCallback, useEffect, useState } from "react";
import ChinaMap from "@/components/ChinaMap";
import Turbin from "@/components/Turbin";
import DataView from "@/components/DataView";
import { useLayerStore } from "@/store/layer";

export default () => {
  const { layerId, layerType } = useLayerStore((state) => ({
    layerId: state.id,
    layerType: state.type
  }))

  return (
    <>
      {
        layerType == 'map' && (
          <>
            <ChinaMap />
            <DataView />
          </>
        )
      }
      {
        layerType == 'device' && (
          <Turbin />
        )
      }
    </>
  )
}
