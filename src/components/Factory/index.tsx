import useFactory from "./hooks/useFactory";
import { useLoadingStore } from "@/store/loading";

export default () => {
  const { loading } = useLoadingStore((state) => ({
    loading: state.loading,
  }))

  const {
    container
  } = useFactory()

  
  return (<>
    <canvas ref={(container as unknown as React.LegacyRef<HTMLCanvasElement>)} style={{visibility: loading? 'hidden': 'visible'}} />
  </>)
}