import React, { useMemo, useContext } from 'react';
import classnames from 'classnames';
import './index.scss';
import { Col } from '../Grid';
import { LabelProps, FloatSize } from './typings';
import { LabelContext } from './Context';

const Label: React.FC<LabelProps> = sourceProps => {
  const labelContext = useContext(LabelContext);
  const props: LabelProps = useMemo(
    () => ({
      ...labelContext,
      ...sourceProps,
    }),
    [sourceProps, labelContext],
  );
  const text = useMemo(() => {
    const sizeClass: {
      [key: string]: any;
    } = {};
    if (typeof props.float === 'object') {
      for (const size of ['xs', 'sm', 'md', 'lg', 'xl', 'xxl']) {
        const target = (props.float as FloatSize)[size as keyof FloatSize];
        if (target) sizeClass[`label-${size}-${target}`] = true;
      }
    } else {
      sizeClass[`label-${props.float}`] = props.float;
    }

    return props.text !== undefined ? (
      <Col
        style={{
          display: 'flex',
          ...props.labelStyle,
        }}
        {...(props.colProps ? props.colProps.label : {})}
      >
        <label
          title={props.text}
          htmlFor={props.id}
          className={classnames(
            'tea-label',
            props.labelClassName,
            {
              'label-required': props.required,
            },
            sizeClass,
          )}
        >
          {props.renderText ?? props.text} {props.colon ? ':' : undefined}
        </label>
      </Col>
    ) : (
      undefined
    );
  }, [
    props.text,
    props.labelClassName,
    props.required,
    props.float,
    props.colProps,
    props.labelStyle,
  ]);

  return (
    <React.Fragment>
      {text}
      <Col
        style={{
          ...props.childrenStyle,
        }}
        {...(props.colProps ? props.colProps.children : {})}
        className={classnames(props.childrenClassName, 'label-children')}
      >
        {props.children}
      </Col>
    </React.Fragment>
  );
};

Label.defaultProps = {
  colon: true,
};

export { LabelContext };

export default Label;
