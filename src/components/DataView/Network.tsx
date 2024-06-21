import {BorderBox1, BorderBox2, ActiveRingChart, BorderBox8, ScrollBoard, BorderBox13, BorderBox10, BorderBox12, BorderBox9, BorderBox6, BorderBox11, Decoration7, Decoration5} from '@jiaminghi/data-view-react';
import Charts from '@jiaminghi/charts';
import { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import DataCon from './DataCon';
import { Column } from '@ant-design/plots';

export default ({style, type="normal"}: any) => {
  const config = {
    data: {
      type: 'fetch',
      value: 'https://render.alipay.com/p/yuyan/180020010001215413/antd-charts/column-column.json',
    },
    xField: 'letter',
    yField: 'frequency',
    // label: {
    //   text: (d: any) => `${(d.frequency * 100).toFixed(1)}%`,
    //   textBaseline: 'bottom',
    // },
    axis: {
      y: {
        labelFormatter: '.0%',
      },
    },
    // style: {
    //   // 圆角样式
    //   radiusTopLeft: 10,
    //   radiusTopRight: 10,
    // },
  };

  return (
    <>
      <DataCon title="网络流量监控" style={style} type={type}>
        <Column {...config} />
      </DataCon>
    </>
    
  )
}