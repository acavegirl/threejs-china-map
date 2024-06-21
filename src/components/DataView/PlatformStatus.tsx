import {BorderBox1, BorderBox2, ActiveRingChart, BorderBox8, ScrollBoard, BorderBox13, BorderBox10, BorderBox12, BorderBox9, BorderBox6, BorderBox11, Decoration7, Decoration5} from '@jiaminghi/data-view-react';
import Charts from '@jiaminghi/charts';
import { LegacyRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import DataCon, {DataConTL} from './DataCon';

export default ({style, type="normal"}: any) => {
  const option3 = {
    data: [
      ["<span style='font-size: 0.8rem'>行1列1</span>", "<span style='font-size: 0.8rem'>行1列1</span>", "<span style='font-size: 0.8rem'>行1列1</span>"],
      ["<span style='font-size: 0.8rem'>行2列1</span>", "<span style='font-size: 0.8rem'>行2列1</span>", "<span style='font-size: 0.8rem'>行2列1</span>"],
      ["<span style='font-size: 0.8rem'>行3列1</span>", "<span style='font-size: 0.8rem'>行3列1</span>", "<span style='font-size: 0.8rem'>行3列1</span>"],
      ["<span style='font-size: 0.8rem'>行4列1</span>", "<span style='font-size: 0.8rem'>行4列1</span>", "<span style='font-size: 0.8rem'>行4列1</span>"],
      ["<span style='font-size: 0.8rem'>行5列1</span>", "<span style='font-size: 0.8rem'>行5列1</span>", "<span style='font-size: 0.8rem'>行5列1</span>"],
      ["<span style='font-size: 0.8rem'>行6列1</span>", "<span style='font-size: 0.8rem'>行6列1</span>", "<span style='font-size: 0.8rem'>行6列1</span>"],
      ["<span style='font-size: 0.8rem'>行7列1</span>", "<span style='font-size: 0.8rem'>行7列1</span>", "<span style='font-size: 0.8rem'>行7列1</span>"],
      ["<span style='font-size: 0.8rem'>行8列1</span>", "<span style='font-size: 0.8rem'>行8列1</span>", "<span style='font-size: 0.8rem'>行8列1</span>"],
      ["<span style='font-size: 0.8rem'>行9列1</span>", "<span style='font-size: 0.8rem'>行9列1</span>", "<span style='font-size: 0.8rem'>行9列1</span>"],
      ["<span style='font-size: 0.8rem'>行10列1</span>", "<span style='font-size: 0.8rem'>行10列1</span>", "<span style='font-size: 0.8rem'>行10列1</span>"]
    ]
  }

  return (
    <>
      <DataConTL title="接入平台状态" style={style} type={type}>
        <ScrollBoard config={option3}/>
      </DataConTL>
    </>
    
  )
}