import React from 'react'
import {
  makeStyles, Table, TableHead, TableRow, TableCell, TableBody, Theme,
} from '@material-ui/core'
// import { MarketItem } from 'models/Market'
import {
  colors, fonts,
} from '@rsksmart/rif-ui'
import WithSpinner from 'components/hoc/WithSpinner'

export type HeadCell<Item> = (
  | {
    id: keyof Item
    label: string
  }
  | {
    id: 'action1' | 'action2' | 'action3'
    label: '' | JSX.Element
  }
)

export type TableItem<Item> = { id: string }
& Item
& {
  [key: string]: JSX.Element
}

export interface MarketplaceProps<Item> {
  className?: string
  items: TableItem<Item>[]
  headers: HeadCell<Item>[]
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
  tr: {
    textAlignLast: 'center',
  },
  'tc-domain': {
    align: 'left',
    color: colors.primary,
  },
}))

const Marketplace = <Item extends object>({
  className = '',
  items,
  headers,
}: MarketplaceProps<Item>): JSX.Element => {
  const classes = useStyles()
  return (
    <div className={`${classes.root} ${className}`}>
      <div className={classes.content}>
        <Table>
          <TableHead>
            <TableRow className={classes.tr}>
              {headers.map((cell: HeadCell<Item>) => (
                <TableCell
                  className={classes.th}
                  key={`th-${cell.id}`}
                >
                  {cell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow className={`${classes.tr} ${index % 2 ? classes.coloredRow : ''}`} key={item.id}>
                {
                  headers.map(({ id }: HeadCell<Item>) => (
                    <TableCell
                      className={`${classes.tc} ${classes[`tc-${id}`]}`}
                      key={`tc-${id}`}
                    >
                      {item[id]}
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

export default WithSpinner(Marketplace)
