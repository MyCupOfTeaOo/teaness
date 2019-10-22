import React from 'react';
import classNames from 'classnames';
import './index.scss';

export interface GlobalFooterProps {
  links?: {
    key?: string;
    title: React.ReactNode;
    href: string;
    /**
     * 是否打开新窗口
     */
    blankTarget?: boolean;
  }[];
  /**
   * copyright
   */
  copyright?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const GlobalFooter: React.FC<GlobalFooterProps> = ({
  className,
  links,
  copyright,
  style,
}) => {
  return (
    <div className={classNames('tea-global-footer', className)} style={style}>
      {links && (
        <div className="links">
          {links.map(link => (
            <a
              key={link.key}
              target={link.blankTarget ? '_blank' : '_self'}
              href={link.href}
            >
              {link.title}
            </a>
          ))}
        </div>
      )}
      {copyright && <div className="copyright">{copyright}</div>}
    </div>
  );
};

export default GlobalFooter;
