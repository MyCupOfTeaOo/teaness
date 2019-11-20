import React from 'react';
import classnames from 'classnames';
import QueueAnim from 'rc-queue-anim';
import { ClearTransferProps } from './typings';
import './index.scss';

export const closeGhostBase64 =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAC6ElEQVQ4T42UP2gUURDGv9m9wCGJEQQNNjGFoHgYbt+sCUELEY0GhEQxYCOIxr9I/EdQCy0sNAqihWhrIQg2Kogoyqko5rJv94iJNkJAUQshoiARvdwbeefukZwXccrZeb99M/N9j/CPGBsbq5+cnGx2XXehMeZnKpV6nc1mv852hGp9iKJorTHmCIAOAB8AfAYwB8BSEXkF4Boz3yQimX5+BmxoaGhuKpW6DiAjIqeKxeLtjo6OH8mBXC6Xqq+vXwfgOBGlp6amtrS3t9uflaMC01o3AngO4BmAQ8xcnK0dEaEwDI/aOsdx1nue96YCiz8+ADDKzLbovyIMwz4RGUin09lMJvO9fLMwDHtF5PD4+Piq3t7eks3l8/n5bW1tE9XU6rzW+gaA98x8ogzTWo+KyEHf95/E8BUi8lREOn3fH06AhUJhcalUygEYYOZbNh/nCo2NjU1UKBSWlEqlx0qp5unb0VrbbZ4C0MnM+QQkIg+Zee/02iAIngI4ZwfZIyLbmbmnuqUESEQ7ROQiET3wPG9ftSS01mcBfLOw3cYY5fv+nlpT11qfAXASwF2l1OZqUDymfgAtFmY3spKZ+2oMu8V13RwRfRSR5US0QSk1VKODYwCaLGy1MWbQ932r9krk8/kyCMB9pdT+KIr6ReS04zhdnue9nF6rtb5ORC9Ia10H4GNdXV2mtbXV2gZRFDUbY6x47ymlDiSthWF4yAKJaGNyQ+uKhoaGT3ZUiTQuA5i0WolnYN2wSyllhz7Df0EQ7HRd95Hnee9iGe0WkW3MvKYMGxkZWVAsFq2Bu5g5+i/5/+lgkTFGA+ix8ql4MwiCLiK66jjOxsRr/4IODw83OY7zEMANZh6cYfS4va0AbMuD6XT6aiaT+VUNtD6OoqhbRC6JyBXf988nNX+9Z2EYLhORCwCyAO6IiG1jgojmxfLoBvDFcZwBz/PskipR83GMPWdttomIlovIfABfReQtEd2fba6/Aee1dW0+liiKAAAAAElFTkSuQmCC';

function ClearTransfer<T extends string | number>(
  props: ClearTransferProps<T>,
) {
  const {
    className,
    style,
    title,
    selectList,
    setSelectList,
    itemStyle,
    itemClassName,
    renderItem,
    disabled,
  } = props;
  return (
    <div
      className={classnames(className, 'tea-transfer-clear', 'tea-transfer')}
      style={style}
    >
      {title && <div className="tea-transfer-title">{title}</div>}
      <QueueAnim duration={200} component="ul" className="tea-transfer-list">
        {selectList.map(item => (
          <li
            key={item.value}
            style={itemStyle}
            className={classnames(itemClassName, 'tea-transfer-item', {
              'tea-transfer-item-disabled': disabled || item.disabled,
            })}
          >
            {renderItem ? (
              renderItem(item)
            ) : (
              <React.Fragment>
                <span title={item.label}>{item.label}</span>
                {!(disabled || item.disabled) && (
                  <img
                    alt=""
                    src={closeGhostBase64}
                    onClick={() =>
                      setSelectList(prevSelectList =>
                        prevSelectList.filter(i => i !== item),
                      )
                    }
                  />
                )}
              </React.Fragment>
            )}
          </li>
        ))}
      </QueueAnim>
    </div>
  );
}

ClearTransfer.defaultProps = {
  title: '已选:',
};

export default ClearTransfer;
