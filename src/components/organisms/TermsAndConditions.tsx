import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import Button from '@material-ui/core/Button'
import React, { FC, useState } from 'react'
import { ModalDialogue } from '@rsksmart/rif-ui'
import CenteredContent from 'components/molecules/CenteredContent'
import RoundBtn from 'components/atoms/RoundBtn'

type TermsAndConditionsProps = {
  checked: boolean
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => void
  terms: React.ReactNode
}

const TermsAndConditions: FC<TermsAndConditionsProps> = (
  { checked, onChange, terms },
) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleTermsClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
  ): void => {
    event.preventDefault()
    setIsDialogOpen(true)
  }

  const handleClose = (): void => setIsDialogOpen(false)

  return (
    <>
      <FormControlLabel
        label={(
          <div>
            <Typography
              component="div"
              variant="caption"
            >
              I have read and agreed with the
              <Button
                component={Link}
                color="primary"
                onClick={handleTermsClick}
              >
                <Typography variant="caption">
                  terms and conditions
                </Typography>
              </Button>
            </Typography>
          </div>
        )}
        control={(
          <Checkbox
            checked={checked}
            onChange={onChange}
          />
        )}
      />
      <ModalDialogue
        title="Terms and conditions"
        open={isDialogOpen}
        onClose={handleClose}
        footer={(
          <RoundBtn color="primary" onClick={handleClose}>
            Close
          </RoundBtn>
        )}
      >
        <CenteredContent>
          {terms}
        </CenteredContent>
      </ModalDialogue>
    </>
  )
}

export default TermsAndConditions
