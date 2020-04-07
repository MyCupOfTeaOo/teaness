import React, { useMemo } from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import { ErrorMessage } from '../../typings';
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
   * 使用哪个组件显示错误信息.默认 BottomText
   */
  mode?: 'tooltip' | 'bottomText';
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

export interface BottomTextProps {
  errMessage?: string;
}

export const BottomText: React.FC<BottomTextProps> = props => {
  const { errMessage } = props;
  return (
    <React.Fragment>
      {props.children}
      <div className="tea-form-err-message">{errMessage}</div>
    </React.Fragment>
  );
};

const ShowError: React.FC<ShowErrorProps> = props => {
  const errMessage = useMemo(
    () =>
      (props.error
        ? props.error.map(item => item.message).join(';')
        : props.error),
    [props.error],
  );

  let child;
  switch (props.mode) {
    case 'tooltip': {
      child = (
        <React.Fragment>
          <Tooltip
            overlayClassName={classnames(props.overlayClassName, 'error-tip')}
            title={errMessage}
            getPopupContainer={props.getPopupContainer}
            visible={!!(props.error && props.error?.length)}
            placement="leftTop"
            {...props.toolTipProps}
          >
            {props.children}
          </Tooltip>
        </React.Fragment>
      );
      break;
    }

    default: {
      child = (
        <React.Fragment>
          <BottomText errMessage={errMessage}>{props.children}</BottomText>
        </React.Fragment>
      );
      break;
    }
  }

  if (props.fragment) {
    return <React.Fragment>{child}</React.Fragment>;
  }

  return (
    <div
      style={props.style}
      className={classnames(
        { 'form-error': !!(props.error && props.error?.length) },
        props.className,
      )}
    >
      {child}
    </div>
  );
};

ShowError.defaultProps = {
  mode: 'bottomText',
  getPopupContainer: e => e.parentElement ?? document.body,
};

export default ShowError;
