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
 */
export const scrollToField = (fieldKey?: string) => {
  try {
    const inputNode = document.querySelector(
      `#${fieldKey?.replace(/\./g, '-')}`,
    );
    if (inputNode) {
      (inputNode as Element & { focus?: () => {} }).focus?.();
      inputNode.scrollIntoView();
    } else {
      const labelNode = document.querySelector(
        `label[for="${fieldKey?.replace(/\./g, '-')}"]`,
      );
      if (labelNode) {
        labelNode.scrollIntoView({
          block: 'center',
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
};
