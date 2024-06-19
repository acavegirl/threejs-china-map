import useDevice from "./hooks/useDevice"
export default () => {
  const {
    container
  } = useDevice()

  
  return (<>
    <canvas ref={(container as unknown as React.LegacyRef<HTMLCanvasElement>)} />
  </>)
}