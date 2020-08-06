import React, { useEffect, useContext } from 'react';

import classNames from 'classnames';
import './index.scss';
import { useValue } from '../hooks';

export interface FooterToolbarProps {
  style?: React.CSSProperties;
  className?: string;
  resize?: boolean;
}

export const FooterToolbarContext = React.createContext<FooterToolbarProps>({});

const FooterToolbar: React.FC<FooterToolbarProps> = props => {
  const width = useValue<string | number>();
  const context = useContext(FooterToolbarContext);
  const { children, className, style, resize = true } = {
    ...context,
    ...props,
  };
  useEffect(() => {
    if (!resize) {
      return;
    }
    const resizeFooterToolbar = () => {
      const sider = document.querySelector(
        '.ant-layout-sider',
      ) as HTMLDivElement;
      if (sider == null) {
        width.setValue(undefined);
        return;
      }
      const newWidth = `calc(100% - ${sider.style.width})`;
      width.setValue(newWidth);
    };
    resizeFooterToolbar();
    window.addEventListener('resize', resizeFooterToolbar);
    return () => {
      window.removeEventListener('resize', resizeFooterToolbar);
    };
  }, [resize]);
  return (
    <div className="tea-footer-toolbar-layout">
      <div
        className={classNames(className, 'tea-footer-toolbar')}
        style={{ width: width.value, ...style }}
      >
        {children}
      </div>
    </div>
  );
};

export default FooterToolbar;
