import React, { FC } from 'react';
import { Button } from 'rifui';
import { useHistory } from 'react-router';
import { makeStyles, Theme, createStyles } from '@material-ui/core';

export interface ReturnButtonProps {
  className?: string
  backTo: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    returnBtn: {
      position: 'fixed',
      top: 100,
      left: 10
    }
  }),
);

const ReturnButton: FC<ReturnButtonProps> = ({ className = '', backTo, onClick }) => {
  const history = useHistory();
  const classes = useStyles()

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    history.goBack();

    !!onClick && onClick(event);
  }
  return (
    <Button className={classes.returnBtn} onClick={handleOnClick}>
      {'<'} Back to {backTo}
    </Button>
  );
};

export default ReturnButton;