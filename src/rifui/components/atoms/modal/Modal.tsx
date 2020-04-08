import React, { FC } from 'react';
import { Modal as MUIModal, ModalProps as MUIModalProps } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { colors } from 'rifui/theme';

// TODO: add props to customize the position of the modal (eg: centered | top ...)
export interface ModalProps extends MUIModalProps { };

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${colors.primary}`,
    boxShadow: theme.shadows[5],
    left: '50%',
    minWidth: 400,
    padding: theme.spacing(2, 4, 3),
    position: 'absolute',
    top: '50%',
    transform: `translate(-50%, -50%)`,
  },
}));

const Modal: FC<ModalProps> = ({ children, ...rest }) => {
  const classes = useStyles();

  return (
    <MUIModal {...rest}>
      <div className={classes.paper}>
        {children}
      </div>
    </MUIModal>
  );
};

export default Modal;
