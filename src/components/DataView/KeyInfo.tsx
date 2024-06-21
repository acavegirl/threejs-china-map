import DataCon from './DataCon';
import React from 'react';
import { ConfigProvider, Divider, Table } from 'antd';
import type { TableColumnsType } from 'antd';

interface DataType {
  key: React.Key;
  name: string;
  age: number;
  address: string;
}
export default ({style, type="normal"}: any) => {
  const columns: TableColumnsType<DataType> = [
    {
      title: 'Date',
      dataIndex: 'name',
    },
    {
      title: 'Health',
      dataIndex: 'age',
    },
    {
      title: 'Problems',
      dataIndex: 'address',
    },
  ];
  
  const data: DataType[] = [
    {
      key: '1',
      name: '2024-06-21',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: '2024-06-20',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: '2024-06-20',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
    },
  ];

  return (
    <>
      <DataCon title="子系统关键信息" style={style} type={type}>
        <ConfigProvider
          theme={{
            components: {
              Table: {
                cellFontSizeSM: 10,
                cellPaddingBlockSM: 4,
                cellPaddingInlineSM: 4,
                colorBgContainer: 'rgba(5, 5, 5, 0.01)',
                borderColor: 'rgba(240, 240, 240, 0.5)',
                headerSplitColor: 'rgba(240, 240, 240, 0.5)',
              },
            },
            token: {
              colorText: '#f0f0f0'
            },
          }}
        >
          <Table columns={columns} dataSource={data} size="small" pagination={false} style={{color: '#f0f0f0'}} />
        </ConfigProvider>
      </DataCon>
    </>
    
  )
}