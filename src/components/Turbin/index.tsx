import { useState } from "react"
import useTurbine from "./hooks/useTurbin"
export default () => {
  const {
    container,
    loading,
    equipmentComposeAnimation,
    equipmentDecomposeAnimation,
  } = useTurbine()

  const [compose, setCompose] = useState(true)
  
  return (<>
    <canvas ref={(container as unknown as React.LegacyRef<HTMLCanvasElement>)} />
    <button
    style={{position: 'absolute', top: 0, left: 0}}
      onClick={()=>{
        if (compose) {
          equipmentDecomposeAnimation()
          setCompose(false)
        } else {
          equipmentComposeAnimation()
          setCompose(true)
        }
      }}
    >分解</button>
  </>)
}