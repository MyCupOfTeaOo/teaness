import React, { useMemo, memo, useContext } from 'react';
import classnames from 'classnames';
import { uniqueId } from 'lodash-es';
import './index.scss';
import { Col } from '../Grid';
import { LabelProps, FloatSize } from './typings';
import { LabelRowContext } from './Context';
import LabelRow from './LabelRow';

const Label: React.FC<LabelProps> = props => {
  const labelRowContext = useContext(LabelRowContext);
  const id = useMemo(() => uniqueId('label'), []);
  const colProps = props.colProps || labelRowContext.colProps;
  const float = props.float || labelRowContext.labelFloat;
  const text = useMemo(() => {
    const sizeClass: {
      [key: string]: any;
    } = {};
    if (typeof float === 'object') {
      for (const size of ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']) {
        const target = (float as FloatSize)[size as keyof FloatSize];
        if (target) sizeClass[`label-${size}-${target}`] = true;
      }
    } else {
      sizeClass[`label-${float}`] = float;
    }

    return props.text ? (
      <Col
        style={{
          display: 'flex',
          ...props.labelStyle,
        }}
        {...(colProps ? colProps.label : {})}
      >
        <label
          title={props.text}
          htmlFor={id}
          className={classnames(
            'tea-label',
            props.className,
            {
              'label-required': props.required,
            },
            sizeClass,
          )}
        >
          {props.text} :
        </label>
      </Col>
    ) : (
      undefined
    );
  }, [
    props.text,
    props.className,
    props.required,
    float,
    colProps,
    props.labelStyle,
    labelRowContext.colProps,
  ]);
  const children = useMemo(
    () =>
      React.Children.map(props.children, child => {
        return React.cloneElement(child as React.ReactElement, {
          id,
        });
      }),
    [props.children],
  );
  return (
    <React.Fragment>
      {text}
      <Col
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          ...props.childrenStyle,
        }}
        {...(colProps ? colProps.children : {})}
      >
        {children}
      </Col>
    </React.Fragment>
  );
};

Label.defaultProps = {};

export { LabelRow, Label };

export default memo(Label);
