import { LayerInfo, useLayerStore } from "@/store/layer";
import { useLoadingStore } from "@/store/loading";

export default () => {
  const { setLayerInfo } = useLayerStore((state) => ({
    setLayerInfo: state.setLayerInfo,
  }))

  const { setLoading } = useLoadingStore((state) => ({
    setLoading: state.setLoading,
  }))

  const setPageChange = (info: LayerInfo) => {
    setLoading(true)
    setLayerInfo(info)
  }
  return setPageChange
}