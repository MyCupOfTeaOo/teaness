import React from 'react';

export interface BarProps {
  children: any;
  /**
   * 测试
   */
  kind: 'ttt' | '111';
  ttt: 'ttt' | '111';
}
const Bar: React.FC<BarProps> = props => {
  return <div>{props.children}</div>;
};

Bar.defaultProps = {
  kind: 'ttt',
};

export default Bar;
