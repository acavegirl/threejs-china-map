import useChinaMap from "./hooks/useChinaMap"
export default () => {
  const {
    container
  } = useChinaMap()

  
  return (<>
    <canvas ref={(container as unknown as React.LegacyRef<HTMLCanvasElement>)} />
  </>)
}