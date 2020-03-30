import React from 'react';
import ReactDOM from 'react-dom';
import PictureModal, {
  PictureModalProps,
  Picture,
  PictureProps,
} from './PictureModal';

export { PictureModal, Picture, PictureProps };

export default function PictureView(params: PictureModalProps) {
  const div = document.createElement('div');
  let isCancel = false;
  document.body.appendChild(div);
  function onCancel() {
    render({ ...params, onCancel, visible: false });
    isCancel = true;
    return new Promise(resolve =>
      setTimeout(() => {
        destory();
        resolve();
      }, 200),
    );
  }
  function destory() {
    if (isCancel) {
      const unmountResult = ReactDOM.unmountComponentAtNode(div);
      if (unmountResult && div.parentNode) {
        div.parentNode.removeChild(div);
      }
    } else {
      onCancel();
    }
  }
  function render(props: PictureModalProps) {
    ReactDOM.render(<PictureModal {...props} />, div);
  }
  render({ ...params, onCancel, visible: true });
  return {
    render,
    onCancel,
    destory,
  };
}
