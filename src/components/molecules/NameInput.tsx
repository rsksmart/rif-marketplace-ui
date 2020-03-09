import {
  FormControl,
  InputGroup,
  InputGroupAppend,
  InputGroupText,
} from 'components/atoms/forms'
import React, { FC } from 'react'

export interface NameInputProps {
  topLevelDomain: string
}

const NameInput: FC<NameInputProps> = ({ topLevelDomain, ...rest }) => {
  return (
    <InputGroup className="mb-3">
      <FormControl
        aria-describedby="basic-addon2"
        autoComplete="off"
        autoFocus={true}
        required={true}
        {...rest}
      />
      <InputGroupAppend>
        <InputGroupText id="basic-addon2">{topLevelDomain}</InputGroupText>
      </InputGroupAppend>
    </InputGroup>
  )
}

export default NameInput
