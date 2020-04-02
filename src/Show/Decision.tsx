import React, { useContext } from 'react';
import Show, { Value } from './Show';

export const DecisionContext = React.createContext<{
  /**
   * 实际值
   */
  actual?: Value;
  /**
   * 占位
   */
  position?: React.ReactNode;
}>({});

export interface CaseProps {
  /**
   * 预期值
   */
  expect?: Value | Value[] | RegExp | ((actual?: Value) => boolean);
  /**
   * 占位
   */
  position?: React.ReactNode;
}

export const Case: React.FC<CaseProps> = props => {
  const context = useContext(DecisionContext);
  return (
    <Show {...context} {...props}>
      {props.children}
    </Show>
  );
};

export interface DecisionProps {
  /**
   * 实际值
   */
  actual?: Value;
  /**
   * 占位
   */
  position?: React.ReactNode;
}

const Decision: React.FC<DecisionProps> & {
  Case: typeof Case;
} = props => {
  const { actual, position } = props;

  return (
    <DecisionContext.Provider
      value={{
        actual,
        position,
      }}
    >
      {props.children}
    </DecisionContext.Provider>
  );
};

Decision.Case = Case;

export default Decision;
