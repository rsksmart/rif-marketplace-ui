import React, { FC } from 'react'
import { Button } from 'rifui';

export interface SelectRowButtonProps {
  className?: string
  id: string
  handleSelect: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const SelectRowButton: FC<SelectRowButtonProps> = ({ className = '', id, handleSelect, children }) => {

  return (
    <Button rounded noShadow
      className={'srb-' + id}
      variant="contained"
      color="primary"
      onClick={handleSelect}
    >
      {!!children ? children : 'Select'}
    </Button>
  )
}

export default SelectRowButton;