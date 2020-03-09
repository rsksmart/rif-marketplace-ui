import React, { FC } from 'react'
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers'


interface Props {
  justified: 'start' | 'end'
}

export type ChatLineProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & Props>


const ChatLine: FC<ChatLineProps> = ({ justified, children }) => {
  return (
    <div
      style={{
        display: 'flex',
        marginBottom: '5px',
        width: '100%',
        justifyContent: `flex-${justified}`,
      }}
    >
      {children}
    </div>
  )
}

export default ChatLine
