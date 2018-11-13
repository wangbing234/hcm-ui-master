import React from 'react';
import { Icon, Menu } from 'antd';
import {
  Button,
  Input,
  Checkbox,
  Radio,
  Switch,
  Tag,
  Dropdown,
  Select,
  Pagination,
  Upload,
} from 'components/Base';

const menu = (
  <Menu>
    <Menu.Item>
      <a href="###">1st menu item</a>
    </Menu.Item>
    <Menu.Item>
      <a href="###">2nd menu item</a>
    </Menu.Item>
    <Menu.Item>
      <a href="###">3rd menu item</a>
    </Menu.Item>
    <Menu.SubMenu title="sub menu">
      <Menu.Item>3rd menu item</Menu.Item>
      <Menu.Item>4th menu item</Menu.Item>
    </Menu.SubMenu>
  </Menu>
);

class TestComponents extends React.Component {
  render() {
    return (
      <div style={{ padding: '30px' }}>
        <h1>Button</h1>
        <div>
          <Button size="small">default</Button>
          <Button type="primary" size="small">
            primary
          </Button>
          <Button type="danger" size="small">
            danger button
          </Button>
          <Button type="warning" size="small">
            warning
          </Button>
          <Button type="success" size="small">
            success
          </Button>
          <Button type="ink" size="small">
            ink
          </Button>
        </div>

        <br />

        <div>
          <Button>default</Button>
          <Button type="primary">primary</Button>
          <Button type="danger">danger button</Button>
          <Button type="warning">warning</Button>
          <Button type="success">success</Button>
          <Button type="ink">ink</Button>
        </div>

        <br />

        <div>
          <Button size="large">default</Button>
          <Button type="primary" size="large">
            primary
          </Button>
          <Button type="danger" size="large">
            danger button
          </Button>
          <Button type="warning" size="large">
            warning
          </Button>
          <Button type="success" size="large">
            success
          </Button>
          <Button type="ink" size="large">
            ink
          </Button>
        </div>

        <br />

        <div>
          <Button display="block" icon="plus">
            添加附件
          </Button>
          <br />
          <br />
          <Button type="danger-light" display="block" icon="plus">
            添加附件
          </Button>
          <br />
          <br />
          <Button type="primary-light" display="block" icon="plus">
            添加附件
          </Button>
          <br />
          <br />
          <Button type="warning-light" display="block" icon="plus">
            添加附件
          </Button>
          <br />
          <br />
          <Button type="success-light" display="block" icon="plus">
            添加附件
          </Button>
          <br />
          <br />
          <Button type="ink-light" display="block" icon="plus">
            添加附件
          </Button>
        </div>
        <br />

        <h1>Input</h1>
        <div>
          <Input size="small" placeholder="input with small size" />
          <br />
          <br />
          <Input placeholder="input with default size" />
          <br />
          <br />
          <Input shadow size="large" placeholder="input with large size" />
          <br />
          <br />
          <Input prefix={<Icon type="search" />} placeholder="input with prefix icon" />
          <br />
          <br />
          <Input
            prefix={<Icon type="search" />}
            size="large"
            placeholder="large input with prefix icon"
          />
          <br />
          <br />
          <Input suffix={<Icon type="down" />} placeholder="input with suffix icon" />
          <br />
          <br />
          <Input
            suffix={<Icon type="down" />}
            size="large"
            placeholder="large input with suffix icon"
          />
          <br />
          <br />
          <Input.Search shadow placeholder="search input with default size" />
          <br />
          <br />
          <Input.Search size="large" placeholder="search input with large size" />
          <br />
          <br />
          <Input.Search placeholder="search input search with default size" enterButton />
          <br />
          <br />
          <Input.Search
            size="large"
            placeholder="search input with large size"
            enterButton={<Icon type="loading" />}
          />
          <br />
          <br />
          <Input.TextArea
            placeholder="textarea with autosize"
            autosize={{ minRows: 2, maxRows: 6 }}
          />
          <br />
          <br />
          <Input.TextArea rows={3} defaultValue="textarea with defaultValue" />
          <br />
          <br />
          <Input.Group compact>
            <Select onChange={window.console.log} defaultValue="Option1" style={{ width: '30%' }}>
              <Select.Option value="Option1">Option1</Select.Option>
              <Select.Option value="Option2">Option2</Select.Option>
            </Select>
            <Input style={{ width: '70%' }} defaultValue="input content" />
          </Input.Group>
        </div>
        <br />
        <h1>Checkbox</h1>
        <div>
          <Checkbox defaultChecked value="primary" color="primary">
            primary with defaultChecked
          </Checkbox>
          <Checkbox checked value="danger" color="danger">
            danger with checked
          </Checkbox>
          <br />
          <br />
          <Checkbox.Group style={{ width: '100%' }} onChange={window.console.log}>
            <Checkbox value="primary" color="primary">
              primary
            </Checkbox>
            <Checkbox value="danger" color="danger">
              danger
            </Checkbox>
            <Checkbox value="warning" color="warning">
              warning
            </Checkbox>
            <Checkbox value="success" color="success">
              success
            </Checkbox>
            <Checkbox value="ink" color="ink">
              ink
            </Checkbox>
            <Checkbox value="dark" color="dark">
              dark
            </Checkbox>
            <Checkbox disabled>disabled</Checkbox>
          </Checkbox.Group>
        </div>
        <br />
        <h1>Radio</h1>
        <div>
          <Radio.Group name="radio" onChange={window.console.log} defaultValue="primary">
            <Radio value="primary" color="primary">
              primary
            </Radio>
            <Radio value="danger" color="danger">
              danger
            </Radio>
            <Radio value="warning" color="warning">
              warning
            </Radio>
            <Radio value="success" color="success">
              success
            </Radio>
            <Radio value="ink" color="ink">
              ink
            </Radio>
            <Radio value="dark" color="dark">
              dark
            </Radio>
          </Radio.Group>
          <br />
          <br />
          <Radio.Group defaultValue="c">
            <Radio.Button value="a">Hangzhou</Radio.Button>
            <Radio.Button value="b">Shanghai</Radio.Button>
            <Radio.Button value="c">Beijing</Radio.Button>
            <Radio.Button value="d">Chengdu</Radio.Button>
          </Radio.Group>
        </div>
        <br />
        <h1>Switch</h1>
        <div>
          <Switch defaultChecked disabled color="primary">
            primary
          </Switch>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Switch color="danger">danger</Switch>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Switch color="warning">warning</Switch>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Switch color="success">success</Switch>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Switch defaultChecked color="ink">
            ink
          </Switch>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Switch color="dark">dark</Switch>
        </div>
        <br />
        <h1>Tag</h1>
        <div>
          <Tag color="primary">primary</Tag>
          <Tag color="danger">danger</Tag>
          <Tag color="warning">warning</Tag>
          <Tag color="success">success</Tag>
          <Tag color="ink">ink</Tag>
          <Tag color="_silver">_silver</Tag>
          <br />
          <br />
          <Tag closable color="primary">
            primary
          </Tag>
          <Tag closable color="danger">
            danger
          </Tag>
          <Tag closable color="warning">
            warning
          </Tag>
          <Tag closable color="success">
            success
          </Tag>
          <Tag closable color="ink">
            ink
          </Tag>
          <Tag closable color="_silver">
            _silver
          </Tag>
          <br />
          <br />
          <Tag.CheckableTag color="primary">primary checkable</Tag.CheckableTag>
          <Tag.CheckableTag color="danger">danger checkable</Tag.CheckableTag>
          <Tag.CheckableTag color="warning">warning checkable</Tag.CheckableTag>
          <Tag.CheckableTag color="success">success checkable</Tag.CheckableTag>
          <Tag.CheckableTag color="ink">ink checkable</Tag.CheckableTag>
          <Tag.CheckableTag color="_silver">_silver checkable</Tag.CheckableTag>
        </div>
        <br />

        <h1>Dropdown</h1>
        <div>
          <Dropdown overlay={menu}>
            <Button type="primary" shape="circle">
              <Icon type="ellipsis" />
            </Button>
          </Dropdown>
        </div>
        <br />

        <h1>Select</h1>
        <div>
          <Select onChange={window.console.log}>
            <Select.Option value="jack">Jack</Select.Option>
            <Select.Option value="lucy">Lucy</Select.Option>
            <Select.Option value="disabled" disabled>
              Disabled
            </Select.Option>
            <Select.Option value="Yiminghe">yiminghe</Select.Option>
          </Select>
          <br />
          <br />
          <Select
            mode="multiple"
            placeholder="Please select"
            onChange={window.console.log}
            style={{ width: '100%' }}
          >
            <Select.Option value="jack">Jack</Select.Option>
            <Select.Option value="lucy">Lucy</Select.Option>
            <Select.Option value="Kevin">Kevin</Select.Option>
            <Select.Option value="Yiminghe">yiminghe</Select.Option>
          </Select>
          <br />
          <br />
          <Select defaultValue="lucy" style={{ width: '100%' }} onChange={window.console.log}>
            <Select.OptGroup key="Manager1" label="Manager">
              <Select.Option value="jack">Jack</Select.Option>
              <Select.Option value="lucy">Lucy</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup key="Manager2" label="Engineer">
              <Select.Option value="Yiminghe">yiminghe</Select.Option>
            </Select.OptGroup>
          </Select>
        </div>
        <br />
        <h1>Pagination</h1>
        <div>
          <Pagination
            defaultCurrent={1}
            total={500}
            showQuickJumper
            showSizeChanger
            onChange={window.console.log}
          />
        </div>
        <br />
        <h1>Upload</h1>
        <Upload
          maxFile={3}
          maxSize={1024 * 1000 * 1}
          defaultValue={[
            {
              fileId: "0e6f9570-c47d-11e8-8af7-2f173f4bf53e",
              filename: "react.pptx",
              filepath: "uploads/react.pptx",
            },
          ]}
        >
          {({ uploadedFiles, uploading }) => {
            window.console.log(uploadedFiles);
            return (
              <Button
                type="primary"
                display="block"
                loading={uploading}
              >
                {uploading ? '正在上传' : '+ 添加附件'}
              </Button>
            )
          }}
        </Upload>
      </div>
    );
  }
}

export default TestComponents;
