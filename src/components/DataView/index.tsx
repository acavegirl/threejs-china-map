import {BorderBox1, BorderBox2, ActiveRingChart, BorderBox8, ScrollBoard, BorderBox13, BorderBox10, BorderBox12, BorderBox9, BorderBox6, BorderBox11, Decoration7, Decoration5} from '@jiaminghi/data-view-react';
import Charts from '@jiaminghi/charts';
import { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import DataCon from './DataCon';
import Realtime from './Realtime';
import PlatformStatus from './PlatformStatus';
import Network from './Network';
import TaskStatus from './TaskStatus';
import TaskFinish from './TaskFinish';
import RunStatus from './RunStatus';
import Capability from './Capability';
import Enhance from './Enhance';
import { column2PosStyle, dataViewItemHeightStyle, dataViewItemSMHeightStyle, dataViewItemSMWidthStyle, dataViewItemWidthStyle } from './styleConst';
import KeyInfo from './KeyInfo';
import Production from './Production';
import Alarm from './Alarm';
import { useDOMStore } from '@/store/dom';

export default () => {
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const right2Ref = useRef(null);

  const setRef = useDOMStore((state) => state.setRef);

  useEffect(() => {
    if (!leftRef.current || !rightRef.current || !right2Ref.current || !setRef) return
    setRef({
      leftRef,
      rightRef,
      right2Ref,
    });
  }, [leftRef.current, rightRef.current, right2Ref.current, setRef]);

  return (
    <>
      <div style={{position: 'absolute', top: '0', }} ref={leftRef}>
        <PlatformStatus style={{...dataViewItemWidthStyle, ...dataViewItemHeightStyle}} />
        <Realtime style={{...dataViewItemWidthStyle, ...dataViewItemHeightStyle}} />
        <KeyInfo style={{...dataViewItemWidthStyle, ...dataViewItemHeightStyle}} />
        <Network style={{...dataViewItemWidthStyle, ...dataViewItemHeightStyle}} />
        
      </div>
      <div style={{position: 'absolute', top: '0', right: '0'}} ref={rightRef}>
        <Capability style={{...dataViewItemSMWidthStyle, ...dataViewItemHeightStyle}} type="small" />
        <TaskFinish style={{...dataViewItemSMWidthStyle, ...dataViewItemHeightStyle}} type="small" />
        <Alarm style={{...dataViewItemSMWidthStyle, ...dataViewItemHeightStyle}} type="small" />
        <Enhance style={{...dataViewItemSMWidthStyle, ...dataViewItemHeightStyle}} type="small" />
      </div>
      <div style={{position: 'absolute', ...column2PosStyle}} ref={right2Ref}>
        <RunStatus style={{...dataViewItemSMWidthStyle, ...dataViewItemSMHeightStyle}} type="small2" />
        <Production style={{...dataViewItemSMWidthStyle, ...dataViewItemSMHeightStyle}} type="small2" />
        <TaskStatus style={{...dataViewItemSMWidthStyle, ...dataViewItemSMHeightStyle}} type="small2" />
      </div>
    </>
    
  )
}