import {ActiveRingChart} from '@jiaminghi/data-view-react';
import Charts from '@jiaminghi/charts';
import { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import DataCon from './DataCon';
import { Bar } from '@ant-design/plots';

export default ({style, type="normal"}: any) => {
  const events = [
    { name: 'event', startTime: 1, endTime: 4 },
    { name: 'layout', startTime: 3, endTime: 13 },
    { name: 'select', startTime: 5, endTime: 8 },
    { name: 'hire', startTime: 9, endTime: 13 },
    { name: 'hire', startTime: 10, endTime: 14 },
    { name: 'hires', startTime: 12, endTime: 17 },
    { name: 'rehearsal', startTime: 14, endTime: 16 },
    { name: 'eventc', startTime: 17, endTime: 18 },
  ];

  const config = {
    data: events,
    xField: 'name',
    yField: ['endTime', 'startTime'],
    colorField: 'name',
    legend: false,
  };
  return (
    <>
      <DataCon title="平台任务状态" style={style} type={type}>
        <Bar {...config} />
      </DataCon>
    </>
    
  )
}


