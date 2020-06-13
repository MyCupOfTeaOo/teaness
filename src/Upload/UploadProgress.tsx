import React, { useState } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import IconButton from '@material-ui/core/IconButton';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import { makeStyles } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import classnames from 'classnames';
import { ProgressStatus } from './typings';
import './styles.scss';

export interface UploadProgressProps {
  progresses: ProgressStatus[];
}

export interface UploadProgressRef extends HTMLDivElement {}

const useStyles = makeStyles({
  percent: (percent: number) => ({
    '--percent': percent,
  }),
});

const variant: Variants = {
  enter: {
    opacity: 0,
    height: 0,
  },
  animate: {
    opacity: 1,
    height: 'inherit',
    transition: {
      duration: 0.4,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    marginBottom: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const UploadProgress: React.ForwardRefRenderFunction<
  UploadProgressRef,
  UploadProgressProps
> = ({ progresses }, ref) => {
  const [open, setOpen] = useState(false);
  const avgPercent =
    Math.floor(
      (progresses.reduce((total, cur) => total + cur.percent, 0) /
        progresses.length) *
        10,
    ) / 10;
  const styles = useStyles(avgPercent);
  const isSuccess = progresses.every(item => item.percent >= 100);
  return (
    <div
      ref={ref}
      tabIndex={-1}
      className={classnames('tea-progress-layout', styles.percent, {
        'tea-progress-open': open,
      })}
    >
      <div
        className={classnames({
          'tea-progress-back': !open,
        })}
      />

      <div className="tea-progress-title">
        {!isSuccess ? (
          <span>正在上传 {progresses.length} 个文件</span>
        ) : (
          <span>上传 {progresses.length} 个文件成功</span>
        )}
        {isSuccess ? (
          <DoneIcon
            className="tea-progress-success"
            style={{ color: '#0EAC70' }}
          />
        ) : (
          <span className="tea-progress-fold">
            {open ? (
              <IconButton component="span" onClick={() => setOpen(false)}>
                <UnfoldLessIcon />
              </IconButton>
            ) : (
              <IconButton component="span" onClick={() => setOpen(true)}>
                <UnfoldMoreIcon />
              </IconButton>
            )}
          </span>
        )}
        <AnimatePresence>
          {!isSuccess && !open && (
            <motion.span
              variants={variant}
              initial="enter"
              animate="animate"
              exit="exit"
              className="tea-progress-avg-percent"
            >
              {avgPercent}%
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {!isSuccess && !open && (
        <div className="tea-progress-progress-progress">
          <div className="fill" />
        </div>
      )}
      <AnimatePresence>
        {!isSuccess &&
          open &&
          progresses.map(item => (
            <motion.div
              variants={variant}
              initial="enter"
              animate="animate"
              exit="exit"
              key={item.uid}
              className="tea-progress-progress-item"
            >
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
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
};

export default React.forwardRef(UploadProgress);
