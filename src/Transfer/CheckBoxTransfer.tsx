import React, { useState, useMemo, useCallback } from 'react';
import classnames from 'classnames';
import { Input, Checkbox } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { SearchOutlined } from '@ant-design/icons';
import { CheckBoxTransferProps } from './typings';

export const clearImg =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAQCAYAAADwMZRfAAABhUlEQVQ4T6WUXUrDQBDH/xUlIqhPprHUPAi+bmnaMzQPIVWo3qFo9QIKtugFfPEGvUJb6D5plJgU9go+2YLfoCCKKCNd2eq2FDoQCPPx252ZnUlALwaARQBzAGb6Lu8AXgE8A/hQwxJ/GFMATAALQ+Ck/gLwCOBO+qgQ+l8BMDsCoJpeANyQQoUsA5gfEyDdHuhGEkKn22QxDCPR7XZPgiCoF4vFKxUahqFv27aTSqVqfT2ldi0hlloHIcQWY2y/0WiUfd8PKSCKIj+fzx9xzvcKhcKZAr+XkFUA0+qpQohNxtgBgZLJ5NIQAIW8EYS+NV0thBClTCZTJVu73d52Xfdc4/c5EhLH8XoulzumtjabzbLneZfDIKT/lw4BHMepcc53TdM0KbVWq7WjAf2kQzJQ2DiONxzHqXLOK67rBuTQ6XRK2WyWQBXP8y50hR1oca/XO42iqC4BMoBA6XSaWZZ1qGsx6SZ+bPL1TvzsCTTuAD4BuNUNoNo93Sqg8ZergNbCr3wDBHWBw/pl/jMAAAAASUVORK5CYII=';

function CheckBoxTransfer<T extends number | string>(
  props: CheckBoxTransferProps<T>,
) {
  const {
    selectList,
    setSelectList,
    options,
    className,
    style,
    title,
    hiddenCheckAll,
    itemStyle,
    itemClassName,
    renderItem,
    disabled,
  } = props;
  const [search, setSearch] = useState('');
  const showList = useMemo(
    () => options.filter(option => option.label.indexOf(search) > -1),
    [options, search],
  );
  const checkAll = useMemo(
    () =>
      showList.every(showItem => {
        return (
          selectList.findIndex(
            selectItem => selectItem.value === showItem.value,
          ) > -1 || showItem.disabled
        );
      }),
    [showList, selectList],
  );
  const onCheckAll = useCallback(() => {
    if (checkAll) {
      setSelectList(prevSelectList => {
        return prevSelectList.filter(
          selectItem =>
            showList.findIndex(
              showItem => showItem.value === selectItem.value,
            ) < 0,
        );
      });
    } else {
      setSelectList(prevSelectList =>
        prevSelectList
          .filter(
            selectItem =>
              showList.findIndex(
                showItem => showItem.value === selectItem.value,
              ) < 0,
          )
          .concat(showList.filter(showItem => !showItem.disabled)),
      );
    }
  }, [showList, checkAll]);
  const onCheckGroup = useCallback(
    (values: Array<CheckboxValueType>) => {
      setSelectList(prevSelectList => {
        // 找到新增的value
        const addTarget = values.find(value => {
          const index = prevSelectList.findIndex(item => item.value === value);
          return index < 0;
        });
        let res = prevSelectList;
        if (addTarget !== undefined) {
          // 新增
          const showTarget = showList.find(item => item.value === addTarget);
          if (showTarget) {
            res = res.concat([showTarget]);
          }
        } else {
          // 删除
          const deleteTarget = prevSelectList
            .filter(
              selectItem =>
                showList.findIndex(
                  showItem => showItem.value === selectItem.value,
                ) > -1,
            )
            .find(
              showSelectItem =>
                values.findIndex(value => value === showSelectItem.value) < 0,
            );
          if (deleteTarget) res = res.filter(item => item.value !== deleteTarget.value);
        }
        return res;
      });
    },
    [showList],
  );
  return (
    <div
      className={classnames(className, 'tea-transfer-checkbox', 'tea-transfer')}
      style={style}
    >
      {title && <div className="tea-transfer-title">{title}</div>}
      <ul className="tea-transfer-list">
        <Input
          className="tea-transfer-input"
          placeholder="搜索"
          value={search}
          onChange={e => setSearch(e.target.value)}
          prefix={<SearchOutlined style={{ color: '#CCC' }} />}
          suffix={
            search ? (
              <img
                alt="清除"
                src={clearImg}
                onClick={() => setSearch('')}
                style={{ cursor: 'pointer' }}
              />
            ) : (
              <span />
            )
          }
        />
        {hiddenCheckAll ? (
          undefined
        ) : (
          <Checkbox
            checked={checkAll}
            onChange={onCheckAll}
            disabled={disabled}
          >
            全选
          </Checkbox>
        )}

        <Checkbox.Group
          value={selectList.map(selectItem => selectItem.value)}
          onChange={onCheckGroup}
        >
          {showList.map(item => (
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
                <Checkbox
                  disabled={disabled || item.disabled}
                  value={item.value}
                >
                  <span title={item.label}>{item.label}</span>
                </Checkbox>
              )}
            </li>
          ))}
        </Checkbox.Group>
      </ul>
    </div>
  );
}

export default CheckBoxTransfer;
