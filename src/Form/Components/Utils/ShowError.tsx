import React, { useMemo } from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import { ErrorMessage } from '../../typings';
import Show from '../../../Show';
import './ShowError.scss';

export interface ShowErrorProps {
  children?: React.ReactNode;
  error?: ErrorMessage[];
  className?: string;
  style?: React.CSSProperties;
  isToolTip?: boolean;
  placement?: Tooltip['props']['placement'];
  overlayClassName?: string;
  getPopupContainer?: Tooltip['props']['getPopupContainer'];
  toolTipProps?: Tooltip['props'];
  notDiv?: boolean;
}

const ShowError: React.FC<ShowErrorProps> = props => {
  const errMessage = useMemo(
    () =>
      (props.error
        ? props.error.map(item => item.message).join(';')
        : props.error),
    [props.error],
  );

  if (props.notDiv) {
    return (
      <React.Fragment>
        <Tooltip
          overlayClassName={classnames(props.overlayClassName, 'error-tip')}
          title={errMessage}
          placement={props.placement}
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
        placement={props.placement}
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
  isToolTip: true,
  placement: 'topLeft',
  getPopupContainer: e => e.parentElement ?? document.body,
};

export default ShowError;

export function ShowErrorHoc<P extends any, T extends React.ComponentType<P>>(
  Component: T,
) {
  const ComponentHasError = (props: P) => {
    const { errors, ...rest } = props as P & { errors?: any };
    return (
      <ShowError error={errors}>
        <Component {...(rest as any)} />
      </ShowError>
    );
  };
  return ComponentHasError as T;
}
