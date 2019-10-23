import React from 'react';
import { Row } from '../Grid';
import { LabelRowProps } from './typings';
import { LabelRowContext } from './Context';

const LabelRow: React.FC<LabelRowProps> = props => {
  const { colProps, labelFloat, ...rest } = props;
  return (
    <LabelRowContext.Provider value={{ colProps, labelFloat }}>
      <Row {...rest} />
    </LabelRowContext.Provider>
  );
};

export default LabelRow;
