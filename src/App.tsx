import { useCallback, useEffect, useState } from "react";
import ChinaMap from "@/components/ChinaMap";
import Turbin from "@/components/Turbin";
import DataView from "@/components/DataView";
import { useLayerStore } from "@/store/layer";
import Factory from "@/components/Factory";
import Device from "@/components/Device";
import { ReturnFactory, ReturnMap, CustomBtn } from "@/components/ReturnBtn"
import SelectionTool from "./components/SelectionTool";

export default () => {
  const { layerId, layerType, setLayerInfo } = useLayerStore((state) => ({
    layerId: state.id,
    layerType: state.type,
    setLayerInfo: state.setLayerInfo,
  }))

  return (
    <>
      {
        layerType == 'map' && (
          <>
            <ChinaMap />
          </>
        )
      }
      {
        layerType == 'factory' && (
          <>
            <Factory />
          </>
        )
      }
      {
        layerType == 'device' && (
          <>
            <Device />
          </>
        )
      }
      <DataView />
      <SelectionTool />
    </>
  )
}
