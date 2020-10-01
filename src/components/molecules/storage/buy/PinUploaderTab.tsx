import { TextField } from '@material-ui/core'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import { fonts } from '@rsksmart/rif-ui'
import GridItem from 'components/atoms/GridItem'
import GridRow from 'components/atoms/GridRow'
import { DropzoneArea, DropzoneAreaProps } from 'material-ui-dropzone'
import React, { FC } from 'react'

const useStyles = makeStyles(() => createStyles({
  root: {
    width: '100%',
    minWidth: '350px',
    minHeight: '100px',
    height: '150px',
    borderRadius: '10px',
  },
  text: {
    fontFamily: fonts.family,
    fontSize: fonts.size.normal,
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
            required
          />
        </GridItem>
      </GridRow>
      <GridRow justify="center">
        <GridItem>
          <DropzoneArea
            {...props}
            classes={{ root: classes.root, text: classes.text }}
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
