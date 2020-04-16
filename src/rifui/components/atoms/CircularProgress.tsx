import React, { FC } from 'react'
import {
  CircularProgress as MUICircularProgress,
  CircularProgressProps as MUICircularProgressProps
} from '@material-ui/core';

export interface CircularProgressProps extends MUICircularProgressProps { }

const CircularProgress: FC<CircularProgressProps> = (props) => {
  return <MUICircularProgress {...props} />
}

export default CircularProgress;