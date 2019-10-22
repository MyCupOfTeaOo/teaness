import React from 'react';
import { Row as AntRow } from 'antd';
import { RowProps } from './typings';
import { RowContext } from './Context';

const Row: React.FC<RowProps> = props => {
  const { colProps, ...rest } = props;
  return (
    <RowContext.Provider
      value={{
        colProps,
      }}
    >
      <AntRow {...rest} />
    </RowContext.Provider>
  );
};

export default Row;
