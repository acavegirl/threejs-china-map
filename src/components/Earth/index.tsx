import { Select } from "antd";
import useEarth from "./hooks/useEarth";
import { useLoadingStore } from "@/store/loading";

export default () => {
  const { loading } = useLoadingStore((state) => ({
    loading: state.loading,
  }))

  const {
    container,
    selectCity,
    citiesRing,
  } = useEarth()

  const changeCity = (value: string, option: any) => {
    // console.log(value, option)
    selectCity(option.position)
  }

  
  return (<>
    <canvas ref={(container as unknown as React.LegacyRef<HTMLCanvasElement>)} style={{visibility: loading? 'hidden': 'visible'}} />
    <Select options={citiesRing} style={{position: 'absolute', top: '0px', left:'0px', width: 200}} onChange={changeCity} />
  </>)
}