import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  Table, TableHead, TableRow, TableCell, TableBody, Typography,
} from '@material-ui/core'

import {
  colors, fonts,
  WithSpinner,
} from '@rsksmart/rif-ui'

export type MarketplaceItem = { id: string, [key: string]: any }

export interface TableHeaders {
  [itemName: string]: string | JSX.Element
}
export interface MarketplaceProps {
  className?: string
  items: MarketplaceItem[]
  headers: TableHeaders
  Heading?: React.ElementType
}

const useStyles = makeStyles((theme: Theme) => ({
  coloredRow: {
    background: colors.gray1,
  },
  content: {
    flex: 1,
    overflow: 'auto',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(2),
    },
  },
  root: {
    display: 'flex',
    flex: '1 1 auto',
  },
  tc: {
    border: 0,
    '&:last-child': {
      textAlignLast: 'center',
    },
  },
  th: {
    color: colors.gray6,
    fontWeight: fonts.weight.light,
    textAlign: 'left',
    textTransform: 'uppercase',
    '&:last-child': {
      textAlignLast: 'center',
    },
  },
  'tc-domain': {
    align: 'left',
    color: colors.primary,
  },
}))

const Marketplace: FC<MarketplaceProps> = ({
  className = '',
  items,
  headers,
  Heading,
}) => {
  const classes = useStyles()
  return (
    <div className={`${classes.root} ${className}`}>
      {!!Heading && <Heading />}
      <div className={classes.content}>
        <Table>
          <TableHead>
            <TableRow>
              {
                Object.keys(headers).map((itemName: string) => (
                  <TableCell className={classes.th} key={`th-${itemName}`}>{headers[itemName]}</TableCell>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              items.map((item, index) => (
                <TableRow className={index % 2 ? classes.coloredRow : ''} key={item.id}>
                  {
                    Object.keys(headers).map((itemName: string) => (
                      <TableCell className={`${classes.tc} ${classes[`tc-${itemName}`]}`} key={itemName}>
                        <Typography>{item[itemName]}</Typography>
                      </TableCell>
                    ))
                  }
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default WithSpinner(Marketplace)
