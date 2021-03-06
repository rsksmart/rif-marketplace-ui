import {
  Table, TableBody, TableCell, TableHead, TableRow as MUITableRow, Typography,
} from '@material-ui/core'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  colors, fonts,
  WithSpinner,
} from '@rsksmart/rif-ui'
import React, { FC } from 'react'

export type MarketplaceItem = { id: string, [key: string]: any }

export interface TableHeaders {
  [itemName: string]: string | JSX.Element
}
export interface MarketplaceProps {
  className?: string
  items: MarketplaceItem[]
  headers: TableHeaders
  Heading?: React.ElementType
  itemDetail?: FC<string>
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
    color: colors.gray4,
    fontSize: fonts.size.small,
    '&:last-child': {
      textAlignLast: 'center',
    },
    '&:first-child': {
      color: colors.gray5,
      fontSize: fonts.size.normal,
    },
  },
  detail: {
    border: 0,
    '&:last-child': {
      textAlignLast: 'left',
    },
    paddingBottom: 0,
    paddingTop: 0,
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
  'tc-domain': { // FIXME: remove non-generic specific styling
    align: 'left',
    color: colors.primary,
  },
}))

const Marketplace: FC<MarketplaceProps> = ({
  className = '',
  items,
  headers,
  Heading,
  itemDetail = (): null => null,
}) => {
  const classes = useStyles()
  return (
    <div className={`${classes.root} ${className}`}>
      {!!Heading && <Heading />}
      <div className={classes.content}>
        <Table>
          <TableHead>
            <MUITableRow>
              {
                Object.keys(headers).map((itemName: string) => (
                  <TableCell className={classes.th} key={`th-${itemName}`}>{headers[itemName]}</TableCell>
                ))
              }
            </MUITableRow>
          </TableHead>
          <TableBody>
            { items.map((item, index) => {
              const rowClassName = index % 2 ? classes.coloredRow : ''
              const rowKey = item.id

              return (
                <React.Fragment key={rowKey}>
                  <MUITableRow className={rowClassName}>
                    {Object.keys(headers).map((itemName: string) => {
                      const cell = item[itemName]

                      return (
                        <TableCell className={`${classes.tc} ${classes[`tc-${itemName}`]}`} key={rowKey + itemName}>
                          {typeof cell === 'string' ? <Typography>{cell}</Typography> : cell}
                        </TableCell>
                      )
                    })}
                  </MUITableRow>
                  <MUITableRow className={rowClassName} key={`${rowKey}plans`}>
                    <TableCell
                      className={classes.detail}
                      colSpan={6}
                    >
                      {itemDetail(rowKey)}
                    </TableCell>
                  </MUITableRow>
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default WithSpinner(Marketplace)
