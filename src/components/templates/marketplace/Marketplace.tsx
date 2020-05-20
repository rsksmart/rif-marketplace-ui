import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core'
import { MarketItemType } from 'models/Market'
import {
  colors, fonts, Table, TableHead, TableRow, TableCell, TableBody,
} from '@rsksmart/rif-ui'

export interface TableHeaders {
  [itemName: string]: string | React.ElementType
}
export interface MarketplaceProps {
  className?: string
  items: MarketItemType[]
  headers: TableHeaders
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
  },
  th: {
    color: colors.gray6,
    fontWeight: fonts.weight.normal,
    textAlign: 'left',
    textTransform: 'uppercase',
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
}) => {
  const classes = useStyles()
  return (
    <div className={`${classes.root} ${className}`}>
      <div className={classes.content}>
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(headers).map((itemName: string) => (
                <TableCell className={classes.th} key={`th-${itemName}`}>{headers[itemName]}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow className={index % 2 ? classes.coloredRow : ''} key={item.id}>
                {
                  Object.keys(headers).map((itemName: string) => (
                    <TableCell className={`${classes.tc} ${classes[`tc-${itemName}`]}`} key={item.id + itemName}>
                      {item[itemName]}
                    </TableCell>
                  ))
                }
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Marketplace
