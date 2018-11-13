# ConfigableField
可配置字段，目前所有自定义字段和与自定义字段行为一致的标准字段都视为可配置字段。可配置字段基于配置，展示不同字段形式。

## 使用

### 导入ConfigableField
```
import configableFieldStrategy from 'components/Biz/ConfigableField';
```

### 配置策略
默认导出为```configableFieldStrategy```，使统一接口可以返回可配置字段和非可配置字段
```
this.createFieldElement = configableFieldStrategy(
  {
    parentId: value => (
      <TreeSelect
        style={{ width: '100%' }}
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={this.getProp('companyTree')}
        placeholder="请选择"
        treeDefaultExpandAll
        onChange={parentId => this.onChange('parentId', parentId)}
      />
    ),
  },
  this.onChange
);
```
```configableFieldStrategy```接收2个参数：
1. **exceptions**：用于配置非自定义字段，对象形式，当字段名与相关key一致时，调用值函数，返回目标组件。
2. **onChange**: 字段变化时，触发该函数；接收字段code与value。

### 使用Element
```
Element = this.createFieldElement(data, config);
```
1. **data**: api返回数据，如companyDTO
2. **config**: 字段配置信息

## 字段配置信息
第一版的表单字段信息由3个源组成
1. 自定义字段配置；包含字段coed，type，order等信息，与自定义字段一致
2. 标准字段配置
3. 标准字段顺序

按照优先标准字段顺序，其次自定义字段order排列成数组，数组内容对应字段配置
