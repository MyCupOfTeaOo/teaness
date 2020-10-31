import React, { useContext, useMemo } from 'react';
import merge from 'lodash-es/merge';

export interface ChangeContextProps<T> {
  /**
   * 上下文对象
   */
  context: React.Context<T>;
  /**
   * 新的上下文
   */
  data?: Partial<T>;
  /**
   * 深度合并
   * @default true
   */
  depth?: boolean;
  /**
   * children
   */
  children?: React.ReactNode;
}

function ChangeContext<T extends any>({
  children,
  context,
  data,
  depth,
}: ChangeContextProps<T>) {
  const ctx = useContext(context);
  const nextCtx = useMemo(() => {
    if (depth) {
      return merge({}, ctx, data);
    }
    return Object.assign({}, ctx, data);
  }, [ctx, data, depth]);
  return <context.Provider value={nextCtx}>{children}</context.Provider>;
}

ChangeContext.defaultProps = {
  depth: true,
};

export default ChangeContext;
