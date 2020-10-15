import React from 'react'
import {
  makeStyles, Table, TableHead, TableRow, TableCell, TableBody, Theme, TableSortLabel,
} from '@material-ui/core'
import {
  colors, fonts,
} from '@rsksmart/rif-ui'
import WithSpinner from 'components/hoc/WithSpinner'

export type HeadCell<Item> = (
  | {
    id: keyof Item
    label: string
    sortable?: boolean
  }
  | {
    id: 'action1' | 'action2' | 'action3'
    label: '' | JSX.Element
    sortable?: boolean
  }
)

export type TableItem<Item> = { id: string }
& Item
& {
  [key: string]: JSX.Element
}

export type TableSort<Item> = {
  by: keyof Item
  order: 'asc' | 'desc'
  onChange: (event: React.MouseEvent<unknown>, property: keyof Item) => void
}

export interface MarketplaceProps<Item> {
  className?: string
  items: TableItem<Item>[]
  headers: HeadCell<Item>[]
  sort?: TableSort<Item>
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
  sort,
}: MarketplaceProps<Item>): JSX.Element => {
  const classes = useStyles()

  const createSortHandler = (property: string) => (event: React.MouseEvent<unknown>): void => sort?.onChange(event, property as keyof Item)

  return (
    <div className={`${classes.root} ${className}`}>
      <div className={classes.content}>
        <Table>
          <TableHead>
            <TableRow className={classes.tr}>
              {headers.map(({ id, label }: HeadCell<Item>) => {
                if (sort) {
                  const { order } = sort
                  const isSortingProp = sort.by === id
                  return (
                    <TableCell
                      className={classes.th}
                      key={id.toString()}
                      sortDirection={isSortingProp ? order : false}
                    >
                      <TableSortLabel
                        active={isSortingProp}
                        direction={isSortingProp ? order : undefined}
                        onClick={createSortHandler(id as string)}
                      >
                        {label}
                      </TableSortLabel>
                    </TableCell>
                  )
                }

                return (
                  <TableCell
                    className={classes.th}
                    key={id.toString()}
                  >
                    {label}
                  </TableCell>
                )
              })}
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
