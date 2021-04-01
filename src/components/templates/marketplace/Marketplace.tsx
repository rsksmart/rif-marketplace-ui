import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  Table, TableHead, TableRow as MUITableRow, TableCell, TableBody, Typography,
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
    '&:last-child': {
      textAlignLast: 'center',
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
  'tc-domain': {
    align: 'left',
    color: colors.primary,
  },
}))

// type TableRowProps = {
//   items: MarketplaceItem[]
//   headers: TableHeaders
//   classes: ReturnType<typeof useStyles>
// }
// const TableRow: FC<TableRowProps> = ({
//   items, classes, headers,
// }) => (
//   <>
//     { items.map((item, index) => (
//       <MUITableRow className={index % 2 ? classes.coloredRow : ''} key={item.id}>
//         {Object.keys(headers).map((itemName: string) => (
//           <TableCell className={`${classes.tc} ${classes[`tc-${itemName}`]}`} key={itemName}>
//             <Typography>{item[itemName]}</Typography>
//           </TableCell>
//         ))}
//       </MUITableRow>
//     ))}
//   </>
// )

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
                <>
                  <MUITableRow className={rowClassName} key={rowKey}>
                    {Object.keys(headers).map((itemName: string) => (
                      <TableCell className={`${classes.tc} ${classes[`tc-${itemName}`]}`} key={itemName}>
                        <Typography>{item[itemName]}</Typography>
                      </TableCell>
                    ))}
                  </MUITableRow>
                  <MUITableRow className={rowClassName} key={rowKey}>
                    <TableCell
                      className={classes.detail}
                      colSpan={6}
                    >
                      {itemDetail(rowKey)}
                    </TableCell>
                  </MUITableRow>
                </>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default WithSpinner(Marketplace)
