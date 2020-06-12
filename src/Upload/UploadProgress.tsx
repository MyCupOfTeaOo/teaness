import React from 'react';
import Modal from '@material-ui/core/Modal';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ProgressStatus } from './typings';
import './styles.scss';

export interface UploadProgressProps {
  progresses: ProgressStatus[];
}

const UploadProgress: React.FC<UploadProgressProps> = ({ progresses }) => {
  return (
    <Modal open={progresses.length > 0} className="tea-progress-mask">
      <div className="tea-progress-layout">
        <div className="tea-progress-title">
          正在上传 {progresses.length} 个文件
        </div>
        {progresses.map(item => (
          <div key={item.uid} className="tea-progress-progress-item">
            <div className="tea-progress-progress-header">
              <span className="tea-progress-progress-fileName">
                {item.name}
              </span>
              <span className="tea-progress-progress-percent">
                {item.percent}%
              </span>
            </div>
            <LinearProgress
              className="tea-progress-progress-progress"
              variant="determinate"
              color={item.status === 'error' ? 'secondary' : 'primary'}
              value={item.percent}
            />
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default UploadProgress;
