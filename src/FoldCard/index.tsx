import React, { useState } from 'react';
import classnames from 'classnames';
import './index.scss';

export const up =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAICAYAAADJEc7MAAAA5UlEQVQoU33Qv0oDQRDH8e/4AHmLrOWtRfZEEBGijUQQFJF05g18HtOJiDb+w0YDIja3KW4tLJw8RXyBkQsqp17ccub3GXZGmPNi0huMVlhya00RaSqOX/TcjL3P3n3wbvN37g8sSj0V4UCwISxMDTsCRsG7bh3/gDHpCdBHeAiZ26iCRakXIuyacJdnbusLf8Nxejs2ZAA8Bu/W69NrX78N3vWq3gwWSYcChwbPuXerTXvHpNdAT5DLjm/vSEyTM7B9gyL3bnnelat6LPUKYRvjSWLSV+C9k7VXRMT+gzOcJiOwxQ+aT0+VV1DvegAAAABJRU5ErkJggg==';

export interface FoldCardProps {
  /**
   * 标题
   */
  title?: React.ReactNode;
  /**
   * 默认状态是否折叠
   */
  defaultFold?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const FoldCard: React.FC<FoldCardProps> = props => {
  const [fold, setFold] = useState(props.defaultFold);
  return (
    <div
      className={classnames('tea-fold-card', props.className)}
      style={props.style}
    >
      <div className="cardTitle">
        {props.title}&nbsp;
        <span
          onClick={() => setFold(prevFold => !prevFold)}
          className={classnames('action', {
            down: fold,
          })}
        >
          <img src={up} alt="收缩" />
        </span>
      </div>
      <div
        className={classnames('cardContent', {
          shrink: fold,
        })}
      >
        {props.children}
      </div>
    </div>
  );
};

FoldCard.defaultProps = {
  defaultFold: false,
};

export default FoldCard;
