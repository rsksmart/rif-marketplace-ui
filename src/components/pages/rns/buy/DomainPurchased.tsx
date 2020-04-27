import React, { FC, useContext, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Button } from 'rifui';
import JobDoneBox from 'components/molecules/JobDoneBox';
import TxCompletePageTemplate from 'components/templates/TxCompletePageTemplate';
import { useHistory } from 'react-router';
import { ROUTES } from 'routes';
import MarketStore from 'store/Market/MarketStore';
import { MARKET_ACTIONS } from 'store/Market/marketActions';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        actions: {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            padding: theme.spacing(3),
            width: 355,
        }
    }),
);

const DomainPurchased: FC<{}> = () => {
    const classes = useStyles();
    const history = useHistory();
    const {
        dispatch
    } = useContext(MarketStore)

    useEffect(() => {
        return () => {
            dispatch({
                type: MARKET_ACTIONS.SELECT_ITEM,
                payload: undefined,
            })
        }
    })


    return (
        <TxCompletePageTemplate>
            <JobDoneBox text='Your domain has been bought.' />
            {/* <a href=''>Check it in the explorer</a> */}
            <div className={classes.actions}>
                <Button
                    color='primary'
                    variant='contained'
                    rounded
                    shadow
                    onClick={() => { alert('This should take you to the RNS admin page.') }}>Admin my domain</Button>
                <Button
                    color='primary'
                    variant='contained'
                    rounded
                    shadow
                    onClick={() => { history.push(ROUTES.DOMAINS.BUY) }}
                >Buy another domain</Button>
            </div>
        </TxCompletePageTemplate>
    );
}

export default DomainPurchased;