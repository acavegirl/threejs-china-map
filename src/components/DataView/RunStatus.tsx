import {ActiveRingChart} from '@jiaminghi/data-view-react';
import { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import DataCon, {DataCon7} from './DataCon';
import { chartConHeight, chartConHeightSM, chartConWidthSM } from './styleConst';

export default ({style, type="normal"}: any) => {
  const onResizeEventRef = useRef<any>();
  const [updateTrigger, setUpdateTrigger] = useState(0)
  // const container = document.getElementById('container')
  useEffect(() => {
    const onResizeEvent = () => {
      setUpdateTrigger((old)=>old+1)
    };
    onResizeEventRef.current = onResizeEvent
    window.addEventListener("resize", onResizeEvent);

    return () => {
      if (onResizeEventRef.current) {
        window.removeEventListener("resize", onResizeEventRef.current);
      }
    };
  }, [])
  const option2 = {
    data: [
      {
        name: '正常',
        value: 55
      },
      {
        name: '暂停',
        value: 120
      },
      {
        name: '闲置',
        value: 78
      },
      {
        name: '维护',
        value: 66
      },
    ],
    digitalFlopStyle: {
      fontSize: '1.5rem',
      fill: '#fff'
    }
  }
  return (
    <>
      <DataCon7 title="平台运行状态" style={style} type={type}>
        <ActiveRingChart key={updateTrigger} config={option2} style={{...chartConWidthSM, ...chartConHeightSM}} />
      </DataCon7>
    </>
    
  )
}


