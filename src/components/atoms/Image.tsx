import React, { FC, HTMLAttributes } from 'react'

import { Image as BSImage, ImageProps as BSImageProps } from 'react-bootstrap'

export interface ImageProps
  extends BSImageProps,
  HTMLAttributes<HTMLImageElement> { }

const Image: FC<ImageProps> = props => {
  return <BSImage {...props} />
}

export default Image
