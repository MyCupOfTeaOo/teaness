import React, { useContext } from 'react';
import Show, { Value } from './Show';

export const SwitchContext = React.createContext<{
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
  const context = useContext(SwitchContext);
  return (
    <Show {...context} {...props}>
      {props.children}
    </Show>
  );
};

export interface SwitchProps {
  /**
   * 实际值
   */
  actual?: Value;
  /**
   * 占位
   */
  position?: React.ReactNode;
}

const Switch: React.FC<SwitchProps> & {
  Case: typeof Case;
} = props => {
  const { actual, position } = props;

  return (
    <SwitchContext.Provider
      value={{
        actual,
        position,
      }}
    >
      {props.children}
    </SwitchContext.Provider>
  );
};

Switch.Case = Case;

export default Switch;
