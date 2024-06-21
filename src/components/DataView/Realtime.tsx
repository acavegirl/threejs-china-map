import DataCon from './DataCon';
import { Line } from '@ant-design/plots';

export default ({style, type="normal"}: any) => {
  const config = {
    data: {
      type: 'fetch',
      value: 'https://render.alipay.com/p/yuyan/180020010001215413/antd-charts/line-connect-nulls.json',
      transform: [
        {
          type: 'map',
          callback: (d: any) => ({
            ...d,
            close: new Date(d.date).getUTCMonth() < 3 ? NaN : d.close,
          }),
        },
      ],
    },
    xField: (d: any) => new Date(d.date),
    yField: 'close',
    connectNulls: {
      connect: true,
      connectStroke: '#aaa',
    },
  };

  return (
    <>
      <DataCon title="系统实时负载" style={style} type={type}>
        <Line {...config}/>
      </DataCon>
    </>
    
  )
}