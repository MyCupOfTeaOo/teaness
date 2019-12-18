import React from 'react';

/**
 * 表单占位
 */
export interface EmptyProps {
  onChange?: (value: any) => void;
  value?: any;
}

const Empty: React.FC<EmptyProps> = () => {
  return <React.Fragment />;
};

export default Empty;
