import { useDOMStore } from "@/store/dom";
import { LayerInfo, useLayerStore } from "@/store/layer";
import { useLoadingStore } from "@/store/loading";
import { useLabelModelStore } from "@/store/model";
import { hideLabelModel } from "@/utils/drawMap";
import gsap from "gsap";
import { useEffect, useRef } from "react";

export default () => {
  const { setLayerInfo, id } = useLayerStore((state) => ({
    setLayerInfo: state.setLayerInfo,
    id: state.id,
  }))

  const { setLoading } = useLoadingStore((state) => ({
    setLoading: state.setLoading,
  }))

  // modelListFromStore在监听函数里使用，为了保证每次都是最新值，需要用ref
  const modelListFromStore = useLabelModelStore((state)=>state.modelList)
  const labelModelList = useRef(modelListFromStore)
  

  useEffect(()=>{
    labelModelList.current = modelListFromStore
  }, [modelListFromStore])
  

  const { leftRef, rightRef, right2Ref } = useDOMStore((state) => ({
    leftRef: state.leftRef,
    rightRef: state.rightRef,
    right2Ref: state.right2Ref,
  }));

  const setPageChange = (info: LayerInfo) => {
    // 如果时当前页面，不跳转
    if (id == info.id) return
    setLoading(true)
    setLayerInfo(info)
    // console.log("labelModelList", labelModelList.current)
    hideLabelModel(labelModelList.current)

    // 数据组件动画
    if (leftRef.current && rightRef.current) {
      let tl = gsap.timeline()
      // tl.to(popDOMRef.current, {opacity: 0}, 0.1)
      const len = leftRef.current.getBoundingClientRect().right + 1
      const len2 = window.innerWidth - right2Ref.current.getBoundingClientRect().left + 1
      tl.to(leftRef.current, {x: `-=${len}`, duration: 1})
      tl.to(rightRef.current, {x: `+=${len}`, duration: 1}, "<")
      tl.to(right2Ref.current, {x: `+=${len2}`, duration: 1}, "<")

      tl.to(leftRef.current, {x: `+=${len}`, duration: 1})
      tl.to(rightRef.current, {x: `-=${len}`, duration: 1}, "<")
      tl.to(right2Ref.current, {x: `-=${len2}`, duration: 1}, "<")
    }
  }
  return setPageChange
}