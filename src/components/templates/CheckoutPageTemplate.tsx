import React, { FC } from 'react';
import { Card } from 'rifui';
import ReturnButton, { ReturnButtonProps } from 'components/molecules/ReturnButton';
import classes from '*.module.css';
import { makeStyles, Theme, createStyles } from '@material-ui/core';

export interface CheckoutPageTemplateProps {
    className?: string
    backButtonProps: ReturnButtonProps
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            display: 'flex',
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
        }
    }),
);

const CheckoutPageTemplate: FC<CheckoutPageTemplateProps> = ({ className = '', backButtonProps, children }) => {
    const classes = useStyles();

    return (
        <div className={className}>
            <ReturnButton {...backButtonProps} />
            <div className={classes.content}>
                {children}
            </div>
        </div>
    )
}

export default CheckoutPageTemplate;