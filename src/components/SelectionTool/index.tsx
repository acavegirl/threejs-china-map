import { useLayerStore } from "@/store/layer";
import { CustomBtn } from "@/components/ReturnBtn"
import { usePageChange } from "@/hooks";

export default () => {
  const setPageChange = usePageChange()
  return (
    <>
      <CustomBtn style={{position: 'absolute', top: '100px', left: 'calc(100vw / 4)'}} text="平台1" onClick={()=>{
        setPageChange({
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