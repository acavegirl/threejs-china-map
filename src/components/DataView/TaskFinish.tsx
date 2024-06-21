import {Decoration9} from '@jiaminghi/data-view-react';
import DataCon from './DataCon';
import { chartConHeight, chartConWidthSM, dataVChartSize } from './styleConst';

export default ({style, type="normal"}: any) => {
  return (
    <>
      <DataCon title="任务完成情况" style={style} type={type}>
        <Decoration9 style={{...dataVChartSize, margin: 'auto'}}>66%</Decoration9>
      </DataCon>
    </>
    
  )
}


