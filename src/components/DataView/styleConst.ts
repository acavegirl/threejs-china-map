const widthCount = 5
const widthCountSM = widthCount+0.5
const heightCount = 4
const heightCountSM = heightCount+0.5
const dataConPadding = 10

export const dataViewItemWidthStyle = {
  width: `calc(100vw / ${widthCount} - ${dataConPadding*2}px)`
}

export const dataViewItemSMWidthStyle = {
  width: `calc(100vw / ${widthCountSM} - ${dataConPadding*2}px)`
}

export const dataViewItemHeightStyle = {
  height: `calc(100vh / ${heightCount} - ${dataConPadding*2}px)`
}
export const dataViewItemSMHeightStyle = {
  height: `calc(100vh / ${heightCountSM} - ${dataConPadding*2}px)`
}

export const dataConPaddingStyle = {
  padding: `${dataConPadding}px`
}


export const chartConWidth = {
  width: `calc(100vw / ${widthCount} - ${dataConPadding*2}px)`
}
export const chartConWidthSM = {
  width: `calc(100vw / ${widthCountSM} - ${dataConPadding*2}px)`
}

export const chartConHeight = {
  height: `calc(100vh / ${heightCount} - ${dataConPadding*2+35}px)`
}
export const chartConHeightSM = {
  height: `calc(100vh / ${heightCountSM} - ${dataConPadding*2+35}px)`
}

export const dataVChartSize = {
  width: `calc(100vh / ${heightCount} - ${dataConPadding*2+35}px)`,
  height: `calc(100vh / ${heightCount} - ${dataConPadding*2+35}px)`
}


export const column2PosStyle = {
  right: `calc(100vw / ${widthCountSM})`,
  top: `calc(100vh / ${heightCount*2})`
}