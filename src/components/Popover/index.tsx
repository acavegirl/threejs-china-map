import { usePopoverStore } from '@/store/popover'
import { usePopDOMStore } from '@/store/dom';
import { useEffect, useRef } from 'react';
import {
  CloseCircleOutlined
} from '@ant-design/icons';
import gsap from "gsap";


export default () => {
  const { popoverData: {name, data} } = usePopoverStore((state) => ({
    popoverData: state.popoverData,
  }))

  const ref = useRef(null);
  const setRef = usePopDOMStore((state) => state.setRef);
  const popDOMRef = usePopDOMStore((state) => state.popDOMRef);

  useEffect(() => {
    if (!ref.current) return
    setRef(ref);
  }, [ref.current, setRef]);

  const closeFn = () => {
    gsap.to(popDOMRef.current, {opacity: 0})
  }

  return (
    <>
      <div
        ref={ref}
        style={{
          position: 'absolute',
          color: '#fff',
          background: "radial-gradient(ellipse, rgba(30, 59, 112, 0.05), rgba(30, 59, 112, 0.5))",
          border: "2px solid rgba(0, 255, 255, 0.1)",
          padding: '0 20px',
          opacity: 0,
          display: 'inline-block'
        }}
      >
        <CloseCircleOutlined style={{position: 'absolute', right: '5px', top: '5px'}} onClick={closeFn} />
        <div style={{paddingTop: '5px'}}>
          <h3>{name}</h3>
          <p>{data}</p>
        </div>
        
      </div>
    </>
  )
}