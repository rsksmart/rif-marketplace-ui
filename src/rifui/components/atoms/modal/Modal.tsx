import React, { FC, useState } from 'react';
import { Modal as MUIModal, ModalProps as MUIModalProps } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { colors } from 'rifui/theme';

export interface ModalProps extends MUIModalProps { };

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    position: 'absolute',
    minWidth: 400,
    backgroundColor: theme.palette.background.paper,
    border: `2px solid ${colors.primary}`,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Modal: FC<ModalProps> = ({ children, ...rest }) => {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);

  return (
    <MUIModal {...rest}>
      <div style={modalStyle} className={classes.paper}>
        {children}
      </div>
    </MUIModal>
  );
};

export default Modal;
