import React, { Component } from 'react';

import classNames from 'classnames';
import './index.scss';

export interface FooterToolbarProps {
  style?: React.CSSProperties;
  className?: string;
  /**
   * 手机端
   */
  isMobile?: boolean;
}

export default class FooterToolbar extends Component<FooterToolbarProps> {
  state = {
    width: undefined,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
    this.resizeFooterToolbar();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    const sider = document.querySelector('.ant-layout-sider') as HTMLDivElement;
    if (sider == null) {
      return;
    }
    const { isMobile } = this.props;
    const width = isMobile ? null : `calc(100% - ${sider.style.width})`;
    const { width: stateWidth } = this.state;
    if (stateWidth !== width) {
      this.setState({ width });
    }
  };

  render() {
    const { children, className, style, ...restProps } = this.props;
    const { width } = this.state;
    return (
      <div className="tea-footer-toolbar-layout">
        <div
          className={classNames(className, 'tea-footer-toolbar')}
          style={{ width, ...style }}
          {...restProps}
        >
          {children}
        </div>
      </div>
    );
  }
}
