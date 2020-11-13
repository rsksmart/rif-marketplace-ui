import React, { FC } from 'react'
import { Button } from '@rsksmart/rif-ui'
/* eslint-disable-next-line import/no-unresolved */
import { ButtonProps } from '@rsksmart/rif-ui/dist/components/atoms/Button'

export interface SelectRowButtonProps extends ButtonProps {
  className?: string
  id: string
  handleSelect: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const SelectRowButton: FC<SelectRowButtonProps> = ({
  id, handleSelect, children, ...rest
}) => (
  <Button
    rounded
    id={id}
    variant="contained"
    color="primary"
    onClick={handleSelect}
    {...rest}
  >
    {children || 'Select'}
  </Button>
)

export default SelectRowButton
