import { Button, ButtonProps, createStyles, makeStyles, Snackbar, Theme } from '@material-ui/core'
import MuiAlert, { Color as Severity } from '@material-ui/lab/Alert'
import React, { FC } from 'react'

export interface InfoBarProps {
    isVisible: boolean
    text: string
    button: ButtonProps
    buttonText: string
    type: Severity
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        alert: {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
        },
        button: {
            padding: 0
        }
    }),
)

const InfoBar: FC<InfoBarProps> = ({ isVisible, text, button, buttonText, type }) => {
    const classes = useStyles();
    const action = <Button {...button} />
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={isVisible}
        >
            <MuiAlert severity={type} className={classes.alert}>
                {text}
                <Button className={classes.button} color='primary' {...button}>{buttonText}</Button>
            </MuiAlert>
        </Snackbar>
        // <div className={`${classes.container} ${isVisible && classes[type]}`}>

        //     {/* <Fade in={isVisible}>
        //         <Typography>{text}<Button {...button}>{buttonText}</Button></Typography>
        //     </Fade> */}
        // </div>
    )
}

export default InfoBar;