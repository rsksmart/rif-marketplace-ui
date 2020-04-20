import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';

export interface ModalBodyProps {
  className?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3, 0),
    width: '100%',
  }
}));

const ModalBody: FC<ModalBodyProps> = ({ children, className = '', ...rest }) => {
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default ModalBody;
