# FetchTable
包含自动获取api的table，固定通用功能与样式

## 使用

### 导出Table的HOC
```
import withFetch from 'components/FetchTable';
```

### 定义不同业务逻辑的组件

Name | Desc
----------|-------------
action | 对应获取列表api的action
modelName | 数据对应的model名
getData | 从state中返回api结果数据
```
const CompanyListTable = withFetch({
  action: GET_COMPANIES,
  modelName: 'company',
  getData: state => state.companyList,
});
```

### Table PropTypes
Name | Desc |
----------|-------------
actionPayload: PropTypes.object | api请求参数，对象形式
headerActions: PropTypes.array | 表格头部操作, 如批量失效
itemActions: PropTypes.array | 行操作, 如删除
onRowClick: PropTypes.func | 行点击, 如编辑
onChangePageConfig | 分页修改，如修改页码和每页大小，接受2个参数, 第一个参数为修改后的页码，第二个参数为修改后的每页大小

**其他参数与ant的table一致**

### 实例
```
<CompanyListTable
  columns={columns}
  actionPayload={this.state}
  headerActions={[
    {
      action: keys => console.log(keys),
      icon: 'icon-disable',
      label: '批量失效',
    },
  ]}
  itemActions={[
    {
      action: (...args) => console.log('查看', ...args),
      label: '查看',
    },
    {
      action: (...args) => console.log('删除', ...args),
      label: '删除',
    },
    {
      action: (...args) => console.log('失效', ...args),
      label: '失效',
    },
  ]}
  onRowClick={ item => console.log('点击行ID：', item.id) }
  onChangePageConfig={this.onChangePageConfig}
/>
```
