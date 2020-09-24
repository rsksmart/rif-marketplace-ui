import { TextField } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import { DropzoneArea, DropzoneAreaProps } from 'material-ui-dropzone'
import React, { FC } from 'react'

const useStyles = makeStyles(() => createStyles({
  root: {
    width: '100%',
    minHeight: '100px',
    height: '150px',
    borderRadius: '10px',
  },
  columnItem: {
    paddingBottom: '10px',
  },
  previewChip: {
    minWidth: 160,
    maxWidth: 210,
  },
}))
const PinUploaderTab: FC<DropzoneAreaProps> = (props) => {
  const classes = useStyles()

  return (
    <>
      <GridRow
        justify="space-evenly"
      >
        <GridItem>
          <TextField
            id="contentName"
            label="Content name"
            variant="outlined"
            required
          />
        </GridItem>
      </GridRow>
      <GridRow justify="center">
        <GridItem>
          <DropzoneArea
            {...props}
            classes={classes}
            showPreviews
            showPreviewsInDropzone={false}
            useChipsForPreview
            previewGridProps={{ container: { spacing: 1, direction: 'row' } }}
            previewChipProps={{ classes: { root: classes.previewChip } }}
            previewText="Selected files"
          />
        </GridItem>
      </GridRow>
    </>
  )
}

export default PinUploaderTab
