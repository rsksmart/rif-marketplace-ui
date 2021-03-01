import React, { FC } from 'react'
import {
  nameServiceImg,
  storageImg,
  triggersImg,
} from '@rsksmart/rif-ui/src/assets/images/icons/landing'
import { makeStyles, Theme } from '@material-ui/core/styles'

export const Icons = {
  DOMAINS: nameServiceImg,
  STORAGE: storageImg,
  TRIGGERS: triggersImg,
}

export interface IconProps {
  alt?: string
  className?: string
  src: string
}

const useStyles = makeStyles((theme: Theme) => ({
  iconImage: {
    height: theme.spacing(40),
  },
}))

const Icon: FC<IconProps> = ({ className = '', src, alt }) => {
console.log("🚀 ---------------------------------------")
console.log("🚀 ~ file: Icon.tsx ~ line 27 ~ src", src)
console.log("🚀 ---------------------------------------")
  
  const classes = useStyles()
  return (
    <img className={`${classes.iconImage} ${className}`.trim()} src={src} alt={alt ?? src} />
  )
}

export default Icon
