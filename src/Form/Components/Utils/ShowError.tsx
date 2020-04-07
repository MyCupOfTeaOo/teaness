import React, { useMemo } from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import { ErrorMessage } from '../../typings';
import Show from '../../../Show';
import './ShowError.scss';

export interface ShowErrorProps {
  children?: React.ReactElement;
  /**
   * 错误信息
   */
  error?: ErrorMessage[];
  /**
   * fragment: true 时失效
   */
  className?: string;
  /**
   * fragment: true 时失效
   */
  style?: React.CSSProperties;
  /**
   * 是否使用 tooltip 展示错误信息
   */
  isToolTip?: boolean;
  /**
   * getPopupContainer,当 isToolTip 为 true 生效,默认  e => e.parentElement ?? document.body
   */
  getPopupContainer?: Tooltip['props']['getPopupContainer'];
  /**
   * toolTip的overlayClassName,当 isToolTip 为 true 生效
   */
  overlayClassName?: string;
  /**
   * toolTip的props,当 isToolTip 为 true 生效,如无特殊需要不要传递 overlayClassName,title,getPopupContainer,visible
   */
  toolTipProps?: Tooltip['props'];
  /**
   * 输入组件外层不包裹div
   */
  fragment?: boolean;
}

const ShowError: React.FC<ShowErrorProps> = props => {
  const errMessage = useMemo(
    () =>
      (props.error
        ? props.error.map(item => item.message).join(';')
        : props.error),
    [props.error],
  );

  if (props.fragment) {
    return (
      <React.Fragment>
        <Tooltip
          overlayClassName={classnames(props.overlayClassName, 'error-tip')}
          title={errMessage}
          getPopupContainer={props.getPopupContainer}
          visible={props.isToolTip && !!(props.error && props.error?.length)}
          {...props.toolTipProps}
        >
          {props.children}
        </Tooltip>
        <Show actual={props.isToolTip} expect={false}>
          <div className="tea-form-err-message">{errMessage}</div>
        </Show>
      </React.Fragment>
    );
  }

  return (
    <div
      style={props.style}
      className={classnames(
        { 'form-error': !!(props.error && props.error?.length) },
        props.className,
      )}
    >
      <Tooltip
        overlayClassName={classnames(props.overlayClassName, 'error-tip')}
        title={errMessage}
        getPopupContainer={props.getPopupContainer}
        visible={props.isToolTip && !!(props.error && props.error?.length)}
        {...props.toolTipProps}
      >
        {props.children}
      </Tooltip>
      <Show actual={props.isToolTip} expect={false}>
        <div className="tea-form-err-message">{errMessage}</div>
      </Show>
    </div>
  );
};

ShowError.defaultProps = {
  isToolTip: false,
  getPopupContainer: e => e.parentElement ?? document.body,
};

export default ShowError;
