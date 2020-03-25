import { Modal as AModal } from 'antd';
import { ModalProps } from 'antd/lib/modal';
import React from 'react';
import ReactDOM from 'react-dom';
import { isFunction } from 'lodash-es';
import { NativeButtonProps } from 'antd/lib/button/button';

interface OpenBase {
  visible?: boolean;
  onCancel?: (...args: any[]) => void | Promise<any>;
  onOk?: (...args: any[]) => void | Promise<any>;
  okButtonProps?: NativeButtonProps;
}

export function open<T extends OpenBase>(
  ModalComponent: React.ComponentType<T>,
  params: T,
) {
  const div = document.createElement('div');
  let isCancel = false;
  let submitting = false;
  document.body.appendChild(div);
  function onOk(...args2: any[]) {
    if (params.onOk) {
      const ok = params.onOk(args2);
      if (ok && isFunction(ok.then)) {
        submitting = true;
        render({
          ...params,
          onCancel,
          onOk,
          visible: true,
          okButtonProps: {
            ...params.okButtonProps,
            loading: submitting,
          },
        });
        ok.then(() => {
          onCancel();
        })
          .catch(() => {})
          .finally(() => {
            submitting = false;
            render({
              ...params,
              onCancel,
              onOk,
              visible: true,
              okButtonProps: {
                ...params.okButtonProps,
                loading: submitting,
              },
            });
          });
      } else {
        onCancel();
      }
    } else {
      onCancel();
    }
  }
  function onCancel(...args: any[]) {
    if (params.onCancel) params.onCancel(args);

    render({ ...params, onCancel, onOk, visible: false });
    isCancel = true;
    return new Promise(resolve =>
      setTimeout(() => {
        destory();
        resolve(true);
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
  function render(props: T) {
    if (!isCancel) ReactDOM.render(<ModalComponent {...props} />, div);
  }
  render({ ...params, onCancel, onOk, visible: true });
  return {
    render,
    onCancel,
    destory,
  };
}

class Modal extends AModal {
  static open = (props: ModalProps & { children?: React.ReactNode }) =>
    open(Modal, props);

  constructor(props: ModalProps, context: {}) {
    super(props, context);
  }
}

Modal.error = props => AModal.error({ centered: true, ...props });
Modal.success = props => AModal.success({ centered: true, ...props });
Modal.confirm = props => AModal.confirm({ centered: true, ...props });
Modal.warning = props => AModal.warning({ centered: true, ...props });

export default Modal;
