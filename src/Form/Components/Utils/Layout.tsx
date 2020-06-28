import React, { useMemo } from 'react';
import { merge, isFunction } from 'lodash-es';
import { Row } from '../../../Grid';
import { RowProps } from '../../../Grid/typings';
import { LabelProps } from '../../../Label/typings';
import { LabelContext } from '../../../Label/Context';

export interface LayoutProps {
  layout?: {
    row?: RowProps;
    label?: LabelProps;
  };
}

const Layout: React.FC<LayoutProps> = ({ layout, children }) => {
  return (
    <LabelContext.Provider value={layout?.label}>
      <Row {...layout?.row}>{children}</Row>
    </LabelContext.Provider>
  );
};

export const vertical: {
  row?: RowProps;
  label?: LabelProps;
} = {
  row: {
    align: 'middle',
    gutter: [6, 24],
    style: {
      marginBottom: -12,
    },
  },
  label: {
    float: 'left',
    colProps: {
      span: 24,
    },
  },
};

export const horizontal: {
  row?: RowProps;
  label?: LabelProps;
} = {
  row: {
    align: 'middle',
    gutter: [6, 24],
    style: {
      marginBottom: -12,
    },
  },
  label: {
    float: 'right',
    labelStyle: {
      minWidth: '40%',
      width: 'fit-content',
      paddingRight: 8,
    },
    colProps: {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
      xs: { span: 24 },
      md: { span: 12 },
      lg: { span: 8 },
      xl: { span: 8 },
    },
  },
};

export const oneline: {
  row?: RowProps;
  label?: LabelProps;
} = {
  row: {
    align: 'middle',
    gutter: [6, 24],
  },
  label: {
    float: 'right',
    labelStyle: {
      minWidth: '40%',
      width: 'fit-content',
      paddingRight: 8,
    },
    childStyle: {
      maxWidth: 300,
    },
    colProps: {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
      xs: { span: 24 },
    },
  },
};

export const inline: {
  row?: RowProps;
  label?: LabelProps;
} = {
  row: {
    align: 'middle',
    gutter: [6, 24],
    style: {
      marginBottom: -12,
    },
  },

  label: {
    labelStyle: {
      paddingRight: 8,
    },
    float: 'right',
    colProps: {
      style: {
        display: 'flex',
        alignItems: 'center',
      },
    },
  },
};

export const login: {
  row?: RowProps;
  label?: LabelProps;
} = {
  row: {
    align: 'middle',
    gutter: [6, 24],
    style: {
      marginBottom: -12,
    },
  },
  label: {
    colProps: {
      span: 24,
      style: {
        display: 'flex',
        width: '100%',
      },
    },
  },
};

export function maskLayout(
  theme: Required<LayoutProps>['layout'],
  layout?: Required<LayoutProps>['layout'],
  options?: { depth: boolean },
): Required<LayoutProps>['layout'];

export function maskLayout<P extends any[]>(
  theme: Required<LayoutProps>['layout'],
  layout?: (...params: P) => Required<LayoutProps>['layout'],
  options?: { depth: boolean },
): (...params: P) => Required<LayoutProps>['layout'];

/**
 * 布局模版
 * @param theme 初始布局
 * @param layout 需要合并的布局
 * @param options {
 *   depth: 是否深合并, 默认为浅合并
 * }
 */
export function maskLayout<P extends any[]>(
  theme: Required<LayoutProps>['layout'],
  layout?:
    | Required<LayoutProps>['layout']
    | ((...params: P) => Required<LayoutProps>['layout']),
  options?: { depth: boolean },
):
  | Required<LayoutProps>['layout']
  | ((...params: P) => Required<LayoutProps>['layout']) {
  if (isFunction(layout)) {
    if (options?.depth) {
      return (...params: P) =>
        useMemo(() => merge({}, theme, layout(...params)), [...params]);
    } else {
      return (...params: P) =>
        useMemo(() => Object.assign({}, theme, layout(...params)), [...params]);
    }
  }
  if (options?.depth) {
    return merge({}, theme, layout);
  }
  return Object.assign({}, theme, layout);
}

export default Layout;
