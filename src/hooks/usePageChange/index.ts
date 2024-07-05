import { useDOMStore, usePopDOMStore } from "@/store/dom";
import { LayerInfo, useLayerStore } from "@/store/layer";
import { useLoadingStore } from "@/store/loading";
import gsap from "gsap";

export default () => {
  const { setLayerInfo, id } = useLayerStore((state) => ({
    setLayerInfo: state.setLayerInfo,
    id: state.id,
  }))

  const { setLoading } = useLoadingStore((state) => ({
    setLoading: state.setLoading,
  }))

  const { leftRef, rightRef, right2Ref } = useDOMStore((state) => ({
    leftRef: state.leftRef,
    rightRef: state.rightRef,
    right2Ref: state.right2Ref,
  }));

  const { popDOMRef } = usePopDOMStore((state) => ({
    popDOMRef: state.popDOMRef,
  }));

  const setPageChange = (info: LayerInfo) => {
    if (id == info.id) return
    setLoading(true)
    setLayerInfo(info)

    if (leftRef.current && popDOMRef.current) {
      let tl = gsap.timeline()
      tl.to(popDOMRef.current, {opacity: 0}, 0.1)
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