import React, { FC } from 'react'
import { Button } from '@rsksmart/rif-ui';

export interface SelectRowButtonProps {
  className?: string
  id: string
  handleSelect: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const SelectRowButton: FC<SelectRowButtonProps> = ({ id, handleSelect, children, ...rest }) => {

  return (
    <Button rounded
      variant="contained"
      color="primary"
      onClick={handleSelect}
      {...rest}
    >
      {!!children ? children : 'Select'}
    </Button>
  )
}

export default SelectRowButton;