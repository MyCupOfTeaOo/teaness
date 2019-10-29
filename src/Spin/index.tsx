import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import './index.scss';

export interface BaseSpinPorps {
  className?: string;
  style?: CSSProperties;
}

export interface SpinProps extends BaseSpinPorps {
  type: 'SquareSpin' | 'TreblingCircle' | 'SpinStretch' | 'Dots';
}

export const SquareSpin: React.FC<BaseSpinPorps> = props => (
  <div
    style={props.style}
    className={classnames('tea-spin-square', props.className)}
  />
);

export const TreblingCircle: React.FC<BaseSpinPorps> = props => (
  <div
    style={props.style}
    className={classnames('tea-spin-treblingCircle', props.className)}
  >
    <div className="outer" />
    <div className="middle" />
    <div className="inner" />
  </div>
);

export const SpinStretch: React.FC<BaseSpinPorps> = props => (
  <div
    style={props.style}
    className={classnames('tea-spin-spinStretch', props.className)}
  />
);
export const Dots: React.FC<BaseSpinPorps> = props => (
  <div
    style={props.style}
    className={classnames('tea-spin-dots', props.className)}
  >
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
);

export const Circle: React.FC<BaseSpinPorps> = props => (
  <svg
    viewBox="25 25 50 50"
    style={props.style}
    className={classnames('tea-spin-circle', props.className)}
  >
    <circle cx="50" cy="50" r="20" />
  </svg>
);
