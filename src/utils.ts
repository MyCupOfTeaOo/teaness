import { ErrorsType } from './Form/typings';

/**
 * 常用的moment日期格式化枚举
 */
export enum DateFormat {
  sec = 'YYYY-MM-DD HH:mm:ss',
  min = 'YYYY-MM-DD HH:mm',
  hour = 'YYYY-MM-DD HH',
  day = 'YYYY-MM-DD',
  month = 'YYYY-MM',
  year = 'YYYY',
}

/**
 * 跳转到表单字段处,如果可以focus则自动focus
 * @param fieldKey 字典id
 * @returns 是否跳转成功
 */
export const scrollToField = (fieldKey?: string) => {
  try {
    const inputNode = document.querySelector(
      `#${fieldKey?.replace(/\./g, '-')}`,
    );
    if (inputNode) {
      (inputNode as Element & { focus?: () => {} }).focus?.();
      inputNode.scrollIntoView();
      return true;
    } else {
      const labelNode = document.querySelector(
        `label[for="${fieldKey?.replace(/\./g, '-')}"]`,
      );
      if (labelNode) {
        labelNode.scrollIntoView({
          block: 'center',
        });
        return true;
      }
    }
  } catch (err) {
    console.error(err);
  }
  return false;
};

/**
 * 根据表单错误信息跳转字段位置
 * @param errs 表单校验错误信息
 * @returns 是否跳转成功,没有错误算成功
 */
export function scrollByFormErrors(errs?: ErrorsType<any>) {
  if (errs) {
    return scrollToField(errs[Object.keys(errs)[0]]?.[0].field);
  }
  return true;
}
