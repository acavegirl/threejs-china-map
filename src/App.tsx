import { useCallback, useEffect, useState } from "react";
import ChinaMap from "@/components/ChinaMap";
import Turbin from "@/components/Turbin";
import DataView from "@/components/DataView";
import { useLayerStore } from "@/store/layer";
import Factory from "@/components/Factory";
import Device from "@/components/Device";
import { ReturnFactory, ReturnMap } from "@/components/ReturnBtn"

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
        layerType == 'factory' && (
          <>
            <Factory />
            <DataView />
            <ReturnMap />
          </>
        )
      }
      {
        layerType == 'device' && (
          <>
            <Device />
            <DataView />
            <ReturnMap />
            <ReturnFactory />
          </>
        )
      }
    </>
  )
}
