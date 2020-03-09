import React, { FC, HTMLAttributes } from 'react'

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  hLevel: 1 | 2 | 3 | 4 | 5
}

const Heading: FC<HeadingProps> = ({ hLevel, children, ...rest }) =>
  React.createElement(`h${hLevel}`, rest, children)

export default Heading
