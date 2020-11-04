import { createStyles, makeStyles } from '@material-ui/core/styles'
import { fonts } from '@rsksmart/rif-ui'
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
    minWidth: '160px',
    maxWidth: '210px',
  },
}))
const PinUploaderTab: FC<DropzoneAreaProps> = (props) => {
  const classes = useStyles()

  return (
    <>
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
    </>
  )
}

export default PinUploaderTab
