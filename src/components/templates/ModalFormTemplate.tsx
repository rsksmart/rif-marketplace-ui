import ModalForm, { ModalFormProps } from 'components/organisms/ModalForm';
import React, { FC, HTMLAttributes } from 'react';
import PageTemplate from './PageTemplate';

export interface ModalFormTemplateProps extends HTMLAttributes<HTMLElement> {
  modalFormProps: ModalFormProps;
}

const ModalFormTemplate: FC<ModalFormTemplateProps> = ({
  children,
  className,
  modalFormProps,
}) => {
  return (
    <PageTemplate className={`${className}-modal`}>
      <ModalForm {...modalFormProps}>{children}</ModalForm>
    </PageTemplate>
  );
};

export default ModalFormTemplate;
