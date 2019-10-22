import { Modal as AModal } from 'antd';
import { ModalProps } from 'antd/lib/modal';

class Modal extends AModal {
  constructor(props: ModalProps, context: {}) {
    super(props, context);
  }
}

Modal.error = props => AModal.error({ centered: true, ...props });
Modal.success = props => AModal.success({ centered: true, ...props });
Modal.confirm = props => AModal.confirm({ centered: true, ...props });
Modal.warning = props => AModal.confirm({ centered: true, ...props });
export default Modal;
