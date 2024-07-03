import { usePopoverStore } from '@/store/popover'
import { usePopDOMStore } from '@/store/dom';
import { useEffect, useRef } from 'react';


export default () => {
  const { popoverData: {name, data} } = usePopoverStore((state) => ({
    popoverData: state.popoverData,
  }))

  const ref = useRef(null);
  const setRef = usePopDOMStore((state) => state.setRef);

  useEffect(() => {
    if (!ref.current) return
    setRef(ref);
  }, [ref.current, setRef]);

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
        <h3>{name}</h3>
        <p>{data}</p>
      </div>
    </>
  )
}