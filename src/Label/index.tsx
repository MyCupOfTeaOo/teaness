import React, { useMemo, useContext } from 'react';
import classnames from 'classnames';
import './index.scss';
import Show from '../Show';
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
  const { colon = true } = props;
  const labelClass = useMemo(() => {
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
    return sizeClass;
  }, [props.float]);

  return (
    <Col {...props.colProps}>
      <Show actual={!!(props.renderText ?? props.text)} expect>
        <label
          title={props.text}
          htmlFor={props.id}
          style={props.labelStyle}
          className={classnames(
            'tea-label',
            props.labelClassName,
            {
              'label-required': props.required,
            },
            labelClass,
          )}
        >
          {props.renderText ?? props.text} {colon ? ':' : undefined}
        </label>
      </Show>
      <div
        className={classnames('label-children', props.childClassName)}
        style={props.childStyle}
      >
        {props.children}
      </div>
    </Col>
  );
};

export { LabelContext };

export default Label;
