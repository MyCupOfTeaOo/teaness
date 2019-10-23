import React, { useMemo } from 'react';
import classnames from 'classnames';
import { ErrorMessage } from '../../typings';

interface ShowErrorProps {
  children: React.ReactNode;
  error?: ErrorMessage[];
  className?: React.CSSProperties;
}

const ShowError: React.FC<ShowErrorProps> = props => {
  const errMessage = useMemo(
    () =>
      (props.error
        ? props.error.map(item => item.message).join(';')
        : props.error),
    [props.error],
  );
  return (
    <div
      className={classnames(
        { formErrorLayout: !!props.error },
        props.className,
      )}
    >
      {props.children}
      <div className="tea-form-err-message">{errMessage}</div>
    </div>
  );
};

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

export default ShowError;
