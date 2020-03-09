import React, { FC } from 'react'
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers'

interface Props {
  color: 'light' | 'primary'
}

export type BubbleProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & Props>


const Bubble: FC<BubbleProps> = ({ children, color }) => {
  return (
    <div
      className={`bubble bg-${color}`}
      style={{
        border: '1px solid #ccc',
        borderRadius: '5px',
        backgroundColor: color,
        padding: '5px',
      }}
    >
      {children}
    </div>
  )
}

export default Bubble
