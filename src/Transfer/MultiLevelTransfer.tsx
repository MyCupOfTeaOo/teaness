import React, { useCallback, useState, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import { Icon, Checkbox } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import {
  MultiLevelTransferProps,
  NavProps,
  NavBarProps,
  MultiLevelItem,
} from './typings';

export const arrowRight =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAOCAYAAAASVl2WAAAA6klEQVQoU23RrUoGQRQG4POyewtGi8EbMNgMYhMULILFoMw5YDGJtyBf+sIu8yOLxWLRZBC8A2/AYDF6BcLCvDKyiuvuie88cH4GMcY9kp+q+iQzhRDCqYgkkjtm9vzfoATe+xMA13PoG5QKIRyJyC2AA+fc/U/+CwZ0LCI3JHfN7LFkIzC02wfwAODQOXc3AQWllLZzzmVgmwVDO5JsJ6DrupW+7z/Ko5mdjUDbtmtVVb2RXJrZ+WjIpmlW67p+Lxurqo3WjDGuk3wFcOWcu/x7TaSUNnLOLyKyUNWLyam991sANlV1MfdZXy25Yp7qCtrDAAAAAElFTkSuQmCC';

export const subDept =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAByElEQVQ4T4WRvWsUARDFf2/jeeLFrwiCkD8gKCKpxeKyh2gRBI2pTgLBgLsWYmXAJigGwUYi2T1UVCxEAoJY+IG3d0okNmplISJWFkHhUhg8c97thN0zxhiM08289xuGeeLvKpd2IauCvoIZsAOzAQr+9J9WrQaDItJZFn7uS7Vs5jkwhetd+h84hDSA6/Wnxii4j/GGgj++NhiV+sEego2C0wK7DPi4Xrg2mKiV8AzGKFgOnDGc2Svkx5r/Bp/c6CLXMPb7c0ThNbDtuP5RqpOdLGTXc/BEbQlefk45nEQcwDSfik68BVOiz/0yb0S8ps8rJv0yGIVvgetYa4oOZWhs+kajbnQ2N8O6JnErD7qA6/WsBMvhK2Tncf3HqyJKBs/CXqSbFE72tsFKOEzMCGI38AXTe2pdhxkcbP1eUAnuYdoLdGO8A26LKJwB5sHxUGsrxgucTA/5kc8pWL21gfhHDdMRiD8gXUTWLaJSBdkD+ryJduDhDGZFCv6ntH96J0fH95dLJxIFxxDDohJMY842zK4iHCDAiXeSPzWbgo8msmQzdaRzxFZDHAdiEQWHEEOYckkIGB8peKdXPKgcjCPtac9Ux+K7i7LqpKMmPGlqAAAAAElFTkSuQmCC';

export function Nav<T>(props: NavProps<T>) {
  const { isCurrent, data } = props;
  const onClick = useCallback(() => {
    if (props.onClick && !isCurrent) props.onClick(data);
  }, [props.onClick, data, isCurrent]);
  return (
    <div
      className={classnames('tea-transfer-nav', {
        'tea-transfer-nav-cur': isCurrent,
      })}
    >
      <a onClick={onClick} title={data.label}>
        {data.label}
      </a>
      {!isCurrent && <img alt="" src={arrowRight} />}
    </div>
  );
}

export function NavBar<T extends string | number>(props: NavBarProps<T>) {
  const { nodes, onClick } = props;

  return (
    <div className="tea-transfer-navbar">
      <div
        className={classnames('tea-transfer-nav', {
          'tea-transfer-nav-cur': !nodes.length,
        })}
      >
        <a
          onClick={() => {
            if (nodes.length && onClick) onClick();
          }}
        >
          <Icon type="home" />
        </a>
        {!!nodes.length && <img alt="" src={arrowRight} />}
      </div>
      {nodes.map((node, index) => (
        <Nav
          key={node.value}
          onClick={onClick}
          data={node}
          isCurrent={index === nodes.length - 1}
        />
      ))}
    </div>
  );
}

function MultiLevelTransfer<T extends string | number>(
  props: MultiLevelTransferProps<T>,
) {
  const {
    options,
    selectList,
    setSelectList,
    style,
    className,
    title,
    hiddenCheckAll,
    itemStyle,
    itemClassName,
    renderItem,
    disabled,
  } = props;
  const [nodes, setNodes] = useState<MultiLevelItem<T>[]>([]);
  const [curOptions, setCurOptions] = useState<MultiLevelItem<T>[]>(options);
  const onClickNode = useCallback((node?: MultiLevelItem<T>) => {
    setNodes(prevNodes => {
      if (node) {
        setCurOptions(node.children || []);
        return prevNodes.slice(
          0,
          prevNodes.findIndex(prevNode => prevNode.value === node.value) + 1,
        );
      } else {
        setCurOptions(options);
        return [];
      }
    });
  }, []);
  const checkAll = useMemo(
    () =>
      curOptions.every(option => {
        return (
          selectList.findIndex(value => value.value === option.value) > -1 ||
          option.disabled
        );
      }),
    [curOptions, selectList],
  );
  const onCheckAll = useCallback(() => {
    if (checkAll) {
      setSelectList(prevSelectList => {
        return prevSelectList.filter(
          selectItem =>
            curOptions.findIndex(
              curOption => curOption.value === selectItem.value,
            ) < 0,
        );
      });
    } else {
      setSelectList(prevSelectList =>
        prevSelectList
          .filter(
            selectItem =>
              curOptions.findIndex(
                curOption => curOption.value === selectItem.value,
              ) < 0,
          )
          .concat(curOptions.filter(curOption => !curOption.disabled)),
      );
    }
  }, [checkAll, curOptions]);
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
          const showTarget = curOptions.find(item => item.value === addTarget);
          if (showTarget) {
            res = res.concat([showTarget]);
          }
        } else {
          // 删除
          const deleteTarget = prevSelectList
            .filter(
              selectItem =>
                curOptions.findIndex(
                  curOption => curOption.value === selectItem.value,
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
    [curOptions],
  );

  useEffect(() => {
    setCurOptions(options);
    setNodes([]);
  }, [options]);
  return (
    <div
      className={classnames(
        className,
        'tea-transfer-mutilevel',
        'tea-transfer-checkbox',
        'tea-transfer',
      )}
      style={style}
    >
      {title && <div className="tea-transfer-title">{title}</div>}
      <ul className="tea-transfer-list">
        <NavBar nodes={nodes} onClick={onClickNode} />
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
          {curOptions.map(item => (
            <li
              key={item.value}
              style={itemStyle}
              className={classnames(itemClassName, 'tea-transfer-item', {
                'tea-transfer-item-disabled': disabled || item.disabled,
              })}
            >
              {renderItem ? (
                renderItem(item, setNodes)
              ) : (
                <React.Fragment>
                  <Checkbox
                    disabled={disabled || item.disabled}
                    value={item.value}
                  >
                    <span title={item.label}>{item.label}</span>
                  </Checkbox>
                  {item.children && (
                    <a
                      className="tea-transfer-leaf-icon"
                      onClick={() => {
                        setNodes(prevNodes => prevNodes.concat([item]));
                        setCurOptions(item.children || []);
                      }}
                    >
                      <img alt="有子级" src={subDept} />
                      下级
                    </a>
                  )}
                </React.Fragment>
              )}
            </li>
          ))}
        </Checkbox.Group>
      </ul>
    </div>
  );
}

export default MultiLevelTransfer;
