import React from 'react';
import { Progress, Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import Img from '../../../Img';
import './styles.scss';
import { UploadFile } from './typings';

export interface UploadModalProps extends ModalProps {
  loadings?: {
    [key: string]: UploadFile;
  };
}

const strokeColor = {
  '0%': '#108ee9',
  '100%': '#87d068',
};

const UploadModal: React.FC<UploadModalProps> = props => {
  const { loadings = {}, ...rest } = props;
  return (
    <Modal
      className="tea-upload-modal"
      maskClosable={false}
      footer={null}
      {...rest}
    >
      <ul className="tea-upload-modal-body">
        {Object.keys(loadings).map(key => (
          <li key={key}>
            <Img
              className="tea-upload-modal-img"
              src={loadings[key].thumbUrl || loadings[key].url}
            />
            <div className="tea-upload-modal-content">
              <span className="tea-upload-modal-title">
                {loadings[key].name}
              </span>
              <Progress
                strokeColor={strokeColor}
                percent={loadings[key].percent}
              />
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
};

export default UploadModal;
