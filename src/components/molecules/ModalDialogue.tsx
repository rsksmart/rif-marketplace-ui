import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from 'components/atoms/modal';
import { ModalProps } from 'components/atoms/modal/Modal';
import React, { FC } from 'react';

export interface ModalDialogueProps extends ModalProps {
  title: string;
  footer?: React.ReactElement;
}

const ModalDialogue: FC<ModalDialogueProps> = ({
  title,
  footer,
  children,
  ...props
}) => {
  return (
    <Modal {...props}>
      <ModalHeader closeButton={true}>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      <ModalBody>{children}</ModalBody>
      <ModalFooter>{footer}</ModalFooter>
    </Modal>
  );
};

export default ModalDialogue;
