import React, { FC } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { colors } from '../../../theme';

export interface ModalFooterProps {
  className?: string;
};

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    borderTop: `1px solid ${colors.gray2}`,
    display: 'flex',
    justifyContent: 'center',
    paddingTop: theme.spacing(1),
    width: '100%',
  }
}));

const ModalFooter: FC<ModalFooterProps> = ({ children, className = '', ...rest }) => {
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${className}`.trim()}>
      {children}
    </div>
  );
};

export default ModalFooter;
