import React from 'react';
import { TinyColor } from '@ctrl/tinycolor';
import { Button, ConfigProvider, Space } from 'antd';
import { useLayerStore } from "@/store/layer";

const colors1 = ['#6253E1', '#04BEFE'];
const colors2 = ['#fc6076', '#ff9a44', '#ef9d43', '#e75516'];
const colors3 = ['#40e495', '#30dd8a', '#2bb673'];
const getHoverColors = (colors: string[]) =>
  colors.map((color) => new TinyColor(color).lighten(5).toString());
const getActiveColors = (colors: string[]) =>
  colors.map((color) => new TinyColor(color).darken(5).toString());

export const ReturnFactory = () => {
  const { setLayerInfo } = useLayerStore((state) => ({
    setLayerInfo: state.setLayerInfo
  }))
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
              colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(', ')})`,
              colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors1).join(', ')})`,
              lineWidth: 0,
            },
          },
        }}
      >
        <Button
          type="primary"
          // size="large"
          style={{position: 'absolute', top: 130, left: 'calc(100vw / 4)', width: 'calc(100vw / 25)', height: 'calc(100vh / 25)'}}
          onClick={()=>{
            setLayerInfo({
              id: '1',
              type: 'factory',
            })
          }}
        >
          返回工厂
        </Button>
      </ConfigProvider>
    </>
  )
}

export const ReturnMap = () => {
  const { setLayerInfo } = useLayerStore((state) => ({
    setLayerInfo: state.setLayerInfo
  }))
  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: `linear-gradient(135deg, ${colors1.join(', ')})`,
              colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(colors1).join(', ')})`,
              colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(colors1).join(', ')})`,
              lineWidth: 0,
            },
          },
        }}
      >
        <Button
          type="primary"
          style={{position: 'absolute', top: 50, left: 'calc(100vw / 4)', width: 'calc(100vw / 25)', height: 'calc(100vh / 25)'}}
          onClick={()=>{
            setLayerInfo({
              id: '2',
              type: 'map',
            })
          }}
        >
          返回地图
        </Button>
      </ConfigProvider>
    </>
  )
}

export function CustomBtn({style, onClick, text}: any) {
  return (
    <>
      <button className="custom-button" style={style} onClick={onClick}>{text}</button>
    </>
  )
}

export default { ReturnFactory, ReturnMap, CustomBtn }