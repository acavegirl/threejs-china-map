import useFactory from "./hooks/useFactory"
export default () => {
  const {
    container
  } = useFactory()

  
  return (<>
    <canvas ref={(container as unknown as React.LegacyRef<HTMLCanvasElement>)} />
  </>)
}