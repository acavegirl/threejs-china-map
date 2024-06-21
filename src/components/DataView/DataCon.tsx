import {BorderBox5, BorderBox4, ActiveRingChart, BorderBox8, ScrollBoard, BorderBox13, BorderBox10, BorderBox12, BorderBox9, BorderBox6, BorderBox11, Decoration7, Decoration5, BorderBox7} from '@jiaminghi/data-view-react';
import { dataConPaddingStyle, chartConWidth, chartConHeight, chartConWidthSM, chartConHeightSM } from './styleConst';

export default ({title, children, style, type='normal'}: any) => {

  return (
    <>
      <BorderBox12 color={['rgba(30, 59, 112, 0.8)']} style={{color: '#fff', textAlign: 'center', ...dataConPaddingStyle, ...style}}>
        <Decoration7 style={{height: '30px', marginBottom: '5px'}}><span style={{margin: '0 10px', color: '#fff'}}>{title}</span></Decoration7>
        {
          type === 'small' && (
            <div style={{...chartConWidthSM, ...chartConHeight}}>
              {children}
            </div>
          )
        }
        {
          type === 'normal' && (
            <div style={{...chartConWidth, ...chartConHeight}}>
              {children}
            </div>
          )
        }
        {
          type === 'small2' && (
            <div style={{...chartConWidthSM, ...chartConHeightSM}}>
              {children}
            </div>
          )
        }
      </BorderBox12>
    </>
  )
}

export const DataCon7 = ({title, children, style, type='normal'}: any) => {
  return (
    <>
      <BorderBox13 style={{color: '#fff', textAlign: 'center', ...dataConPaddingStyle, ...style}}>
        <Decoration7 style={{height: '30px', margin: '5px 0'}}><span style={{margin: '0 10px', color: '#fff'}}>{title}</span></Decoration7>
        {
          type === 'small' ? (
            <div style={{...chartConWidthSM, ...chartConHeight}}>
              {children}
            </div>
          ): (
            <div style={{...chartConWidth, ...chartConHeight}}>
              {children}
            </div>
          )
        }
      </BorderBox13>
    </>
  )
}

export const DataConTL = ({title, children, style, type='normal'}: any) => {
  return (
    <>
      <BorderBox8 color={['rgba(30, 59, 112, 0.8)']} style={{color: '#fff', textAlign: 'center', ...dataConPaddingStyle, ...style}}>
        <Decoration7 style={{height: '30px', margin: '5px 0'}}><span style={{margin: '0 10px', color: '#fff'}}>{title}</span></Decoration7>
        {
          type === 'small' ? (
            <div style={{...chartConWidthSM, ...chartConHeight}}>
              {children}
            </div>
          ): (
            <div style={{...chartConWidth, ...chartConHeight}}>
              {children}
            </div>
          )
        }
      </BorderBox8>
    </>
  )
}

export const DataConBR = ({title, children, style, type='normal'}: any) => {
  return (
    <>
      <BorderBox9 color={['rgba(30, 59, 112, 0.8)']} style={{color: '#fff', textAlign: 'center', ...dataConPaddingStyle, ...style}}>
        <Decoration7 style={{height: '30px', margin: '5px 0'}}><span style={{margin: '0 10px', color: '#fff'}}>{title}</span></Decoration7>
        {
          type === 'small' ? (
            <div style={{...chartConWidthSM, ...chartConHeight}}>
              {children}
            </div>
          ): (
            <div style={{...chartConWidth, ...chartConHeight}}>
              {children}
            </div>
          )
        }
      </BorderBox9>
    </>
  )
}