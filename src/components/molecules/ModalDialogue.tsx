import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from 'rifui/components/atoms/modal';
import React, { FC } from 'react';
import { ModalProps } from 'rifui/components/atoms/modal/Modal';

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
      <>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter>{footer}</ModalFooter>
      </>
    </Modal>
  );
};

export default ModalDialogue;
