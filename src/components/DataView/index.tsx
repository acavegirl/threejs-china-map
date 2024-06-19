import {BorderBox1, BorderBox2, ActiveRingChart, BorderBox8, ScrollBoard, BorderBox13, BorderBox10, BorderBox12, BorderBox9, BorderBox6} from '@jiaminghi/data-view-react';
import Charts from '@jiaminghi/charts';
import { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { nextTick } from 'process';

export default () => {
  const container = useRef();
  const container2 = useRef();
  const onResizeEventRef = useRef<any>();
  const [updateTrigger, setUpdateTrigger] = useState(0)
  // const container = document.getElementById('container')
  useEffect(() => {
    if (!container.current || !container2.current) return ;
    const myChart = new Charts(container.current)
    const myChart2 = new Charts(container2.current)
    const option1 = {
      title: {
        text: '周销售额趋势'
      },
      xAxis: {
        name: '第二周',
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        name: '销售额',
        data: 'value'
      },
      series: [
        {
          data: [1200, 2230, 1900, 2100, 3500, 4200, 3985],
          type: 'line',
          lineArea: {
            show: true,
            gradient: ['rgba(55, 162, 218, 0.6)', 'rgba(55, 162, 218, 0)']
          }
        }
      ]
    }

    
    myChart.setOption(option1)
    myChart2.setOption(option1)

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
  }, [container.current, container2.current])

  const option2 = {
    data: [
      {
        name: '周口',
        value: 55
      },
      {
        name: '南阳',
        value: 120
      },
      {
        name: '西峡',
        value: 78
      },
      {
        name: '驻马店',
        value: 66
      },
      {
        name: '新乡',
        value: 80
      }
    ]
  }

  const option3 = {
    data: [
      ['行1列1', '行1列2', '行1列3'],
      ['行2列1', '行2列2', '行2列3'],
      ['行3列1', '行3列2', '行3列3'],
      ['行4列1', '行4列2', '行4列3'],
      ['行5列1', '行5列2', '行5列3'],
      ['行6列1', '行6列2', '行6列3'],
      ['行7列1', '行7列2', '行7列3'],
      ['行8列1', '行8列2', '行8列3'],
      ['行9列1', '行9列2', '行9列3'],
      ['行10列1', '行10列2', '行10列3']
    ]
  }

  return (
    <>
      <div style={{position: 'absolute', top: '0', }}>
        <BorderBox1 style={{width: 'calc(100vw / 5)', height: 'calc(100vh / 3)'}}>
          <div ref={(container as unknown as LegacyRef<HTMLDivElement>)} style={{width: 'calc(100vw / 5)', height: 'calc(100vh / 3)'}}></div>
        </BorderBox1>
        <BorderBox2 style={{width: 'calc(100vw / 5)', height: 'calc(100vh / 3)'}}>
          <ActiveRingChart key={updateTrigger} config={option2} style={{width: 'calc(100vw / 5)', height: 'calc(100vh / 3)'}} />
        </BorderBox2>
        <BorderBox8 style={{width: 'calc(100vw / 5 - 20px) ', height: 'calc(100vh / 3 - 20px)', padding: '10px'}}>
          <ScrollBoard config={option3} style={{width: 'calc(100vw / 5 - 20px) ', height: 'calc(100vh / 3 - 20px)'}} />
        </BorderBox8>
      </div>

      <div style={{position: 'absolute', top: '0', right: '0'}}>
        <BorderBox13 style={{width: 'calc(100vw / 5)', height: 'calc(100vh / 3)'}}>
          <div ref={(container2 as unknown as LegacyRef<HTMLDivElement>)} style={{width: 'calc(100vw / 5)', height: 'calc(100vh / 3)'}}></div>
        </BorderBox13>
        <BorderBox9 style={{width: 'calc(100vw / 5)', height: 'calc(100vh / 3)'}}>
          <ActiveRingChart key={updateTrigger} config={option2} style={{width: 'calc(100vw / 5)', height: 'calc(100vh / 3)'}} />
        </BorderBox9>
        <BorderBox12 style={{width: 'calc(100vw / 5 - 20px) ', height: 'calc(100vh / 3 - 20px)', padding: '10px'}}>
          <ScrollBoard config={option3} style={{width: 'calc(100vw / 5 - 20px) ', height: 'calc(100vh / 3 - 20px)'}} />
        </BorderBox12>
      </div>
    </>
    
  )
}