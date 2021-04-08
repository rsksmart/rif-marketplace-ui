import React, { FC } from 'react'
import { Button } from '@rsksmart/rif-ui'
/* eslint-disable-next-line import/no-unresolved */
import { ButtonProps } from '@rsksmart/rif-ui/dist/components/atoms/Button'

export interface SelectRowButtonProps extends ButtonProps {
  className?: string
  id: string
  isSelected?: boolean
  handleSelect: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const SelectRowButton: FC<SelectRowButtonProps> = ({
  id, handleSelect, isSelected, children, ...rest
}) => (
  <Button
    rounded
    id={id}
    variant="contained"
    color={isSelected ? 'secondary' : 'primary'}
    onClick={handleSelect}
    {...rest}
  >
    {children || 'Select'}
  </Button>
)

export default SelectRowButton
