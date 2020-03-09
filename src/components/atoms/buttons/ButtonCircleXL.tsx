import React, { FC } from 'react'
import ButtonCircle from './ButtonCircle'
import { ButtonProps } from './Button'

const ButtonCircleXL: FC<ButtonProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <ButtonCircle className={`btn-xl ${className}`} {...rest}>
      {children}
    </ButtonCircle>
  )
}

export default ButtonCircleXL
