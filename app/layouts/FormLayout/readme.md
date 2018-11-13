# Layout
主要用于表单提交的左右分栏布局，内置Layout, Row, Column, FullRow, SplitRow。

## Usage
Layout, Row, Column类似于table布局的table, tr, td。可直接从FormLayout导出。
```
import { Layout, Row, Column, FullRow, SplitRow } from 'layouts/FormLayout';
```
双列
```
<Layout>
  <Row>
    <Column>
      <Input />
    </Column>
    <Column>
      <Input />
    </Column>
  </Row>
</Layout>
```
单列左侧
```
<Layout>
  <Row>
    <Column>
      <Input />
    </Column>
  </Row>
</Layout>
```
单列整行: Row包含属性cols，默认为2；如需单列整行，设置为1即可
```
<Layout>
  <Row cols={1}>
    <Column>
      <Input />
    </Column>
  </Row>
</Layout>
```
### 为了减少样本代码，暴露出FullRow与SplitRow组件

双列
```
<Layout>
  <SplitRow>
    <Input />
    <Input />
  </SplitRow>
</Layout>
```
单列左侧
```
<Layout>
  <SplitRow>
    <Input />
  </SplitRow>
</Layout>
```
单行整列
```
<Layout>
  <FullRow>
    <Input />
  </FullRow>
</Layout>
```

### More
左侧列表，右侧照片
```
<Row>
  <Column>
    <FullRow>
      <TestInput />
    </FullRow>
    <FullRow>
      <TestInput />
    </FullRow>
    <FullRow>
      <TestInput />
    </FullRow>
  </Column>
  <Column>
    <div style={{ float: 'right' }}>
      <Avatar shape="square" size="large" icon="user" />
    </div>
  </Column>
</Row>
```
自定义整行
```
<FullRow>
  <div style={{ display: 'flex', flex: 1 }}>
    <div style={{ width: 120 }}>自定义</div>
    <div style={{ flex: 1 }}>
      <Row>
        <TestInput />
      </Row>
      <Row>
        <TestInput />
      </Row>
      <Row>
        <TestInput />
      </Row>
    </div>
  </div>
</FullRow>
```
