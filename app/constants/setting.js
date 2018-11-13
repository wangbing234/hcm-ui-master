export const TABLE_DEFAULT_COLUMNS = [
  {
    title: '模版名称',
    dataIndex: 'title',
  },
  {
    title: '是否支持多条记录',
    dataIndex: 'multiRecord',
    render: record => (record ===true ? '是' : '否'),
  },
  {
    title: '模块是否必填',
    dataIndex: 'required',
    render: record => (record ? '必填' : '选填'),
  },
  {
    title: '员工入职是否启用',
    dataIndex: 'onBoard',
    render: record => (record ? '启用' : '不启用'),
  },
];
