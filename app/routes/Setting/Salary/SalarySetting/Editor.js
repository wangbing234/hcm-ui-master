import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable'
import styles from './Editor.less';



// 处理插入内容位置
function insertAtCursor(target, html) {
  target.focus();
  if (window.getSelection) {
    const sel = window.getSelection();
    const range = sel.getRangeAt(0); // 获取第一个光标位置
    range.deleteContents(); // 移除选中内容
    const frag = document.createDocumentFragment();
    const el = document.createElement("div");
    el.innerHTML = html;
    const node = el.firstChild;
    frag.appendChild(node);
    range.insertNode(frag);
  }
}

function createVariable(text) {
  return `<code contenteditable="false" class="var">&nbsp;${text}&nbsp;</code>`;
}
class DraftEditor extends Component {

  onChange = (value) => {
    this.props.onChange(value);
  }

  // 通过公式 code 找到对应的名称
  getNameByCode = (code) => {
    const { salaryOption } = this.props;
    const result = salaryOption.find(option => {
      return option.code === code;
    });
    if (result) {
      return result.name;
    }
  }

  editorRef = null;

  // 输入时
  handleChange = (event) => {
    this.onChange(event.target.value);
  };

  // 失去焦点
  handleBlur = () => {
    const { onBlur } = this.props;
    onBlur();
  }

  // 处理 value
  handleValue = (value) => {
    if (!value.trim()) return '';
    const reg = /\$\{[\w\u0590-\u05ff]+\}/g;
    const suffix = '<br>';
    const result = value.replace(reg, (code) => {
      const variable = this.getNameByCode(code);
      return variable ? createVariable(variable) : code;
    });
    return !result.endsWith(suffix) ? `${result}${suffix}` : result;
  }

  // 插入变量
  handleInsert = (variable) => {
    const { htmlEl, emitChange } = this.editorRef;
    const { code } = variable;
    insertAtCursor(htmlEl, code);
    emitChange();
  }

  render() {
    const { value, disabled } = this.props;
    return (
      <ContentEditable
        ref={e => { this.editorRef = e }}
        className={styles.editor}
        html={this.handleValue(value)}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        disabled={disabled}
        placeholder="请输入数值或公式"
      />
    )
  }
}

export default DraftEditor;

