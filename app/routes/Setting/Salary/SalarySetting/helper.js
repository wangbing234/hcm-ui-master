// 根据错误的 meta.code 信息匹配字段名
export function getFieldFromMeta(meta) {
  let field = '';
  switch(meta.code) {
    case '20002': // 薪资项名称重复
    field = 'name';
    break;
    case '20005': // 公式解析错误
    field = 'formula';
    break;
    default:
    break;
  }
  return field;
}
