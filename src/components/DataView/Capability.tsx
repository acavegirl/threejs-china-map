import DataCon from './DataCon';
import { Radar } from '@ant-design/plots';

const data = [
  { name: 'A', star: 10371 },
  { name: 'B', star: 7380 },
  { name: 'C', star: 7414 },
  { name: 'D', star: 2140 },
  { name: 'E', star: 660 },
  { name: 'F', star: 885 },
  { name: 'G', star: 1626 },
];
export default ({style, type="normal"}: any) => {
  const config = {
    data: data.map((d) => ({ ...d, star: Math.sqrt(d.star) })),
    xField: 'name',
    yField: 'star',
    area: {
      style: {
        fillOpacity: 0.2,
      },
    },
    scale: {
      x: {
        padding: 0.5,
        align: 0,
      },
      y: {
        nice: true,
      },
    },
    axis: {
      x: {
        title: false,
        grid: true,
        gridStroke: '#fff',
        gridStrokeOpacity: 1,
        lineStroke: '#fff',
        lineStrokeOpacity: 1,
        labelFill: '#fff'
      },
      y: {
        grid: true,
        gridStroke: '#fff',
        gridStrokeOpacity: 1,
        label: false,
        title: false,
      },
    },
  };

  return (
    <>
      <DataCon title="能力模型" style={style} type={type}>
        <Radar {...config} />
      </DataCon>
    </>
    
  )
}