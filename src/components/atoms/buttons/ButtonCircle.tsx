import React, { FC } from 'react'
import Button, { ButtonProps } from './Button'

const ButtonCircle: FC<ButtonProps> = ({
  children,
  className = '',
  ...rest
}) => {
  return (
    <Button className={`btn-circle ${className}`} {...rest}>
      {children}
    </Button>
  )
}

export default ButtonCircle
