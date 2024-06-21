import { useLayerStore } from "@/store/layer";
import { CustomBtn } from "@/components/ReturnBtn"

export default () => {
  const { setLayerInfo } = useLayerStore((state) => ({
    setLayerInfo: state.setLayerInfo,
  }))
  return (
    <>
      <CustomBtn style={{position: 'absolute', top: '100px', left: 'calc(100vw / 4)'}} text="平台1" onClick={()=>{
        setLayerInfo({
          id: 'map',
          type: 'map',
        })
      }} />
      <CustomBtn style={{position: 'absolute', top: '160px', left: 'calc(100vw / 4)'}} text="平台2" onClick={()=>{
        // setLayerInfo({
        //   id: '2',
        //   type: 'map',
        // })
      }} />
      <CustomBtn style={{position: 'absolute', top: '220px', left: 'calc(100vw / 4)'}} text="平台3" onClick={()=>{
        // setLayerInfo({
        //   id: '2',
        //   type: 'map',
        // })
      }} />
    </>
  )
}