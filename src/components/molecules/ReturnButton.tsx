import React, { FC } from 'react'
import { Button } from '@rsksmart/rif-ui'
import { useHistory } from 'react-router-dom'

export interface ReturnButtonProps {
  backTo: string
  className?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const ReturnButton: FC<ReturnButtonProps> = ({ className = '', backTo, onClick }) => {
  const history = useHistory()

  const handleOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    history.goBack()

    if (onClick) onClick(event)
  }
  return (
    <Button
      className={className}
      color="secondary"
      onClick={handleOnClick}
    >
      {`< Back to ${backTo}`}
    </Button>
  )
}

export default ReturnButton
