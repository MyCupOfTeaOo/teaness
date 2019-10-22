import React, { useContext } from 'react';
import { Col as AntCol } from 'antd';
import { ColProps } from './typings';
import { RowContext } from './Context';

const Col: React.FC<ColProps> = props => {
  const context = useContext(RowContext);
  return <AntCol {...context.colProps} {...props} />;
};

export default Col;
