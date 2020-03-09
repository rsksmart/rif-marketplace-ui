import React, { FC, useContext } from 'react';

import Button from 'components/atoms/buttons/Button';
import { Form } from 'components/atoms/forms';
import { ModalProps } from 'components/atoms/modal/Modal';
import ModalDialogue from 'components/molecules/ModalDialogue';
import AppStore from 'store/App/AppStore';

export interface ModalFormProps {
  formik: any;
  modalProps: ModalProps;
  submitBtnLabel: string;
  title: string;
}

const ModalForm: FC<ModalFormProps> = ({
  formik,
  children,
  submitBtnLabel,
  title,
  modalProps,
}) => {
  const {
    state: {
      AppState: {
        message: { isLoading },
      },
    },
  } = useContext(AppStore);

  return (
    <Form>
      <ModalDialogue
        title={title}
        footer={
          <Button
            variant="primary"
            type="button"
            className="ml-auto justify-content-end"
            disabled={isLoading || !formik.isValid}
            onClick={formik.submitForm}
          >
            {submitBtnLabel}
          </Button>
        }
        {...modalProps}
      >
        {children}
      </ModalDialogue>
    </Form>
  );
};

export default ModalForm;
