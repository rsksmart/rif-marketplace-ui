import React, { FC } from 'react'
import { Button, colors } from '@rsksmart/rif-ui'
import {
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Grid,
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

export interface ActiveContractsProps {
  className?: string
}

const ActiveContracts: FC<ActiveContractsProps> = ({ className = '' }) => (
  <Grid className={className} container>
    <Typography gutterBottom color="primary" variant="subtitle1">Active contracts</Typography>
    <TableContainer>
      <Table
        aria-labelledby="table of active contracts"
        size="small"
        aria-label="enhanced table"
      >
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Content Size</TableCell>
            <TableCell>Renewal Date</TableCell>
            <TableCell>Subscription Type</TableCell>
            <TableCell>Monthly Fee</TableCell>
            <TableCell>Available Funds</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Typography component="div"><Box color={colors.gray5}>juan.rsk</Box></Typography>
            </TableCell>
            <TableCell>
              <Typography color="primary">74 GB</Typography>
            </TableCell>
            <TableCell>24 May 2021</TableCell>
            <TableCell>Monthly</TableCell>
            <TableCell>
              <Typography color="primary">3245 RIF</Typography>
            </TableCell>
            <TableCell>
              <Typography color="primary">3245 RIF</Typography>
            </TableCell>
            <TableCell>
              <Button style={{ marginRight: 4 }} color="primary" rounded variant="outlined">Withdraw</Button>
              <Button color="primary" rounded variant="outlined">View</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography component="div"><Box color={colors.gray5}>juan.rsk</Box></Typography>
            </TableCell>
            <TableCell>
              <Typography color="primary">74 GB</Typography>
            </TableCell>
            <TableCell>24 May 2021</TableCell>
            <TableCell>Monthly</TableCell>
            <TableCell>
              <Typography color="primary">3245 RIF</Typography>
            </TableCell>
            <TableCell>
              <Typography color="primary">3245 RIF</Typography>
            </TableCell>
            <TableCell>
              <Button style={{ marginRight: 4 }} color="primary" rounded variant="outlined">Withdraw</Button>
              <Button color="primary" rounded variant="outlined">View</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography component="div"><Box color={colors.gray5}>juan.rsk</Box></Typography>
            </TableCell>
            <TableCell>
              <Typography color="primary">74 GB</Typography>
            </TableCell>
            <TableCell>24 May 2021</TableCell>
            <TableCell>Monthly</TableCell>
            <TableCell>
              <Typography color="primary">3245 RIF</Typography>
            </TableCell>
            <TableCell>
              <Typography color="primary">3245 RIF</Typography>
            </TableCell>
            <TableCell>
              <Button style={{ marginRight: 4 }} color="primary" rounded variant="outlined">Withdraw</Button>
              <Button color="primary" rounded variant="outlined">View</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <Typography component="div"><Box color={colors.gray5}>juan.rsk</Box></Typography>
            </TableCell>
            <TableCell>
              <Typography color="primary">74 GB</Typography>
            </TableCell>
            <TableCell>24 May 2021</TableCell>
            <TableCell>Monthly</TableCell>
            <TableCell>
              <Typography color="primary">3245 RIF</Typography>
            </TableCell>
            <TableCell>
              <Typography color="primary">3245 RIF</Typography>
            </TableCell>
            <TableCell>
              <Button style={{ marginRight: 4 }} color="primary" rounded variant="outlined">Withdraw</Button>
              <Button color="primary" rounded variant="outlined">View</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </Grid>
)

export default ActiveContracts
