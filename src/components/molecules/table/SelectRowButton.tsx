import React, { FC } from 'react'
import { Button } from '@rsksmart/rif-ui'

export interface SelectRowButtonProps {
  className?: string
  id: string
  handleSelect: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const SelectRowButton: FC<SelectRowButtonProps> = ({
  id, handleSelect, children, ...rest
}) => (
  <Button
    rounded
    variant="contained"
    color="primary"
    onClick={handleSelect}
    {...rest}
  >
    {children || 'Select'}
  </Button>
)

export default SelectRowButton
