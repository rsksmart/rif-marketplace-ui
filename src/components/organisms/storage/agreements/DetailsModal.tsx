import { makeStyles, Theme } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Modal from '@material-ui/core/Modal'
import {
  ModalBody, ModalHeader, ModalTitle,
} from '@rsksmart/rif-ui'
/* eslint-disable-next-line import/no-unresolved */
import { ModalProps } from '@rsksmart/rif-ui/dist/components/atoms/modal/Modal'
import GridColumn from 'components/atoms/GridColumn'
import GridItem from 'components/atoms/GridItem'
import RifCard from 'components/organisms/RifCard'
import { AgreementCustomerView, AgreementProviderView } from 'components/organisms/storage/agreements/utils'
import React, { FC } from 'react'

export type DetailsModalProps = {
  modalProps: Omit<ModalProps, 'children'>
  itemDetails: AgreementCustomerView | AgreementProviderView | undefined
  actions: React.ElementType
}

const useModalStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'contents',
    width: 'initial',
  },
  modalWidth: {
    width: 'initial',
  },
  itemDetails: {
    marginTop: `${theme.spacing(2)}px`,
  },
  itemName: {
    textAlign: 'right',
  },
}))

const DetailsModal: FC<DetailsModalProps> = ({ modalProps, itemDetails, actions }) => {
  const modalCardStyleClasses = useModalStyles()
  return (
    <Modal
      {...modalProps}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <>
        <ModalBody className={modalCardStyleClasses.modalWidth}>
          <RifCard
            className={modalCardStyleClasses.root}
            Actions={actions}
          >
            <ModalHeader className={modalCardStyleClasses.modalWidth}>
              <ModalTitle>{itemDetails?.title}</ModalTitle>
            </ModalHeader>
            <GridColumn
              spacing={2}
              className={modalCardStyleClasses.itemDetails}
            >
              {
              itemDetails && Object.keys(itemDetails)
                .filter((k) => k !== 'title')
                .map((key) => (
                  <Grid
                    key={key}
                    item
                    container
                    direction="row"
                    spacing={6}
                    xs={12}
                  >
                    <GridItem
                      xs={6}
                      className={modalCardStyleClasses.itemName}
                    >
                      <Typography
                        variant="body2"
                        color="textSecondary"
                      >
                        {key}
                      </Typography>
                    </GridItem>
                    <GridItem xs={6}>{itemDetails[key]}</GridItem>
                  </Grid>
                ))
                  }
            </GridColumn>
          </RifCard>
        </ModalBody>
      </>
    </Modal>
  )
}

export default DetailsModal
