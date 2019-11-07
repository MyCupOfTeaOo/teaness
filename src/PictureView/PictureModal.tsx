import React, { useState, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import Draggable from 'react-draggable';
import { Button } from 'antd';
import Modal from '../Modal';
import Img, { ImgProps } from '../Img';
import './styles.scss';

export interface PictureModalProps extends ImgProps {
  modalClassName?: string;
  /**
   * 默认放大倍数
   */
  defaultZoom?: number;
  /**
   * 默认旋转角度
   */
  defaultAngle?: number;
  visible?: boolean;
  onCancel?: () => void;
  /**
   * 默认宽度,一般不需要设置
   */
  width?: string | number;
}

const PictureModal: React.FC<PictureModalProps> = props => {
  const {
    defaultZoom = 1,
    defaultAngle = 0,
    visible,
    onCancel,
    modalClassName,
    className,
    width,
    style,
    ...rest
  } = props;
  const [zoom, setZoom] = useState(defaultZoom);
  const [angle, setAngle] = useState(defaultAngle);
  const plus = useCallback(() => {
    setZoom(prevZoom => prevZoom + 0.1);
  }, []);
  const minus = useCallback(() => {
    setZoom(prevZoom => {
      if (prevZoom > 0.2) return prevZoom - 0.1;
      return prevZoom;
    });
  }, []);
  const left = useCallback(() => {
    setAngle(prevAngle => prevAngle - 90);
  }, []);
  const right = useCallback(() => {
    setAngle(prevAngle => prevAngle + 90);
  }, []);
  const onScroll = useCallback(({ wheelDelta }) => {
    if (wheelDelta > 0) plus();
    if (wheelDelta < 0) minus();
  }, []);

  useEffect(() => {
    document.addEventListener('mousewheel', onScroll);
    return () => document.removeEventListener('mousewheel', onScroll);
  }, []);
  return (
    <Modal
      className={classnames(modalClassName, 'tea-picture-view-modal')}
      visible={visible}
      footer={null}
      onCancel={onCancel}
      width={width}
    >
      <div className="tea-picture-view-content">
        <Draggable>
          <div style={{ padding: 2 }}>
            <Img
              className={classnames(className, 'tea-picture-view-img')}
              style={{
                transform: `scale(${zoom}) rotate(${angle}deg)`,
                ...style,
              }}
              {...rest}
            />
          </div>
        </Draggable>
        <div className="tea-picture-view-btns">
          <Button
            size="large"
            ghost
            shape="circle"
            onClick={plus}
            icon="plus"
          />
          <Button
            size="large"
            ghost
            shape="circle"
            onClick={minus}
            icon="minus"
          />
          <Button
            size="large"
            ghost
            shape="circle"
            onClick={left}
            icon="undo"
          />
          <Button
            size="large"
            ghost
            shape="circle"
            onClick={right}
            icon="redo"
          />
        </div>
      </div>
    </Modal>
  );
};

PictureModal.defaultProps = {
  alt: '文件加载失败',
  defaultZoom: 1,
  defaultAngle: 0,
  width: '100vw',
  backupSrc:
    'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNTczMTI3MjM3NzUzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwNzAgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjEyMDQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjA4Ljk4NDM3NSIgaGVpZ2h0PSIyMDAiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTk4MS43ODMyNzMgMEg4NS4yMjQ3MjdDMzguMzUzNDU1IDAgMCAzNS4zNzQ1NDUgMCA4My4wODM2MzZ2ODQ0Ljg5MzA5MWMwIDQ3LjYxNiAzOC4zNTM0NTUgODYuNTc0NTQ1IDg1LjE3ODE4MiA4Ni41NzQ1NDZoOTAzLjYzMzQ1NGM0Ni45MTc4MTggMCA4MS43MzM4MTgtMzguOTU4NTQ1IDgxLjczMzgxOS04Ni41NzQ1NDZWODMuMDgzNjM2QzEwNzAuNTkyIDM1LjM3NDU0NSAxMDI4LjcwMTA5MSAwIDk4MS43ODMyNzMgMHpNMzM1LjgyNTQ1NSAxMzUuOTEyNzI3Yzc0LjE5MzQ1NSAwIDEzNC4zMzAxODIgNjAuOTc0NTQ1IDEzNC4zMzAxODEgMTM2LjI4NTA5MSAwIDc1LjE3MDkwOS02MC4xMzY3MjcgMTM2LjE5Mi0xMzQuMzMwMTgxIDEzNi4xOTItNzQuMjg2NTQ1IDAtMTM0LjUxNjM2NC02MS4wMjEwOTEtMTM0LjUxNjM2NC0xMzYuMTkyIDAtNzUuMjY0IDYwLjIyOTgxOC0xMzYuMjg1MDkxIDEzNC41MTYzNjQtMTM2LjI4NTA5MXogbS0xNjEuNTEyNzI4IDc0NS45Mzc0NTVhNDEuODkwOTA5IDQxLjg5MDkwOSAwIDAgMS0yNy42NDgtMTAuMzc5NjM3IDQzLjc1MjcyNyA0My43NTI3MjcgMCAwIDEtNC42NTQ1NDUtNjEuMDY3NjM2bDE5OC4wOTc0NTQtMjU1LjE2MjE4MmE0Mi4xMjM2MzYgNDIuMTIzNjM2IDAgMCAxIDU3LjcxNjM2NC02LjcwMjU0NWwxMTYuNTQ5ODE4IDEyOC4xMzk2MzYgMjg2LjkwNjE4Mi0zNTIuODE0NTQ1YzE0LjYxNTI3My0xOC43MTEyNzMgOTAuMjUxNjM2LTEwNi43NzUyNzMgMTM1Ljg2NjE4Mi02LjkzNTI3MyAwLjA5MzA5MS0wLjA5MzA5MSAwLjA5MzA5MSAxMTIuOTY1ODE4IDAuMjMyNzI3IDI0Ny43NjE0NTUgMC4wOTMwOTEgMTQwLjggMC4wOTMwOTEgMzE3LjA2NzYzNiAwLjA5MzA5MSAzMTcuMDY3NjM2LTEuMDI0LTAuMDkzMDkxLTc2Mi43NDAzNjQgMC4wOTMwOTEtNzYzLjExMjcyNyAwLjA5MzA5MXoiIHAtaWQ9IjEyMDUiIGRhdGEtc3BtLWFuY2hvci1pZD0iYTMxM3guNzc4MTA2OS4wLmkyIj48L3BhdGg+PC9zdmc+',
};
export default PictureModal;
