import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { Button } from 'rifui';
import JobDoneBox from 'components/molecules/JobDoneBox';
import TxCompletePageTemplate from 'components/templates/TxCompletePageTemplate';
import { useHistory } from 'react-router';
import { ROUTES } from 'routes';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        actions: {
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
        }
    }),
);

const DomainPurchased: FC<{}> = () => {
    const classes = useStyles();
    const history = useHistory();

    return (
        <TxCompletePageTemplate>
            <JobDoneBox text='Your domain has been bought.' />
            {/* <a href=''>Check it in the explorer</a> */}
            <div className={classes.actions}>
                <Button onClick={() => { alert('This should take you to the RNS admin page.') }}>Admin my domain</Button>
                <Button onClick={() => { history.push(ROUTES.DOMAINS.BUY) }}>Buy another domain</Button>
            </div>
        </TxCompletePageTemplate>
    );
}

export default DomainPurchased;