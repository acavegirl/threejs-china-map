import { useCallback, useEffect, useState } from "react";
import ChinaMap from "@/components/ChinaMap";
import Turbin from "@/components/Turbin";
import DataView from "@/components/DataView";
import { useLayerStore } from "@/store/layer";
import { useLoadingStore } from "@/store/loading";
import Factory from "@/components/Factory";
import Device from "@/components/Device";
import { ReturnFactory, ReturnMap, CustomBtn } from "@/components/ReturnBtn"
import SelectionTool from "./components/SelectionTool";
import {Loading} from '@jiaminghi/data-view-react';
import { color } from "d3";

export default () => {
  const { layerType } = useLayerStore((state) => ({
    layerType: state.type,
  }))

  const { loading } = useLoadingStore((state) => ({
    loading: state.loading,
  }))

  return (
    <div className="canvas-container" style={{background: '#222831'}}>
      {
        loading && (
          <Loading style={{color: '#fff'}}>加载中……</Loading>
        )
      }
      <div className="canvas-container">
        {
          layerType == 'map' && (
            <>
              <ChinaMap />
              <DataView />
              <SelectionTool />
            </>
          )
        }
        {
          layerType == 'factory' && (
            <>
              <Factory />
              <DataView />
              <SelectionTool />
            </>
          )
        }
        {
          layerType == 'device' && (
            <>
              <Device />
              <DataView />
              <SelectionTool />
            </>
          )
        }
      </div>
    </div>
  )
}
