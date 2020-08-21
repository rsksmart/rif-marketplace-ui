import InfoBar from 'components/molecules/InfoBar'
import React, { useContext } from 'react'
import { RemoveMessagePayload } from 'context/App/appActions'
import AppContext from 'context/App/AppContext'
import Logger from 'utils/Logger'
import { MessageId, Message, ErrorMessage } from 'models/UIMessage'

const logger = Logger.getInstance()

const ErrorPanel = () => {
  const {
    state: {
      messages,
    }, dispatch,
  } = useContext(AppContext)

  return (
    <>
      {(Object.keys(messages) as MessageId[]).map((id: MessageId) => {
        const { customAction, error, ...rest } = messages[id] as Message & ErrorMessage

        if (error) {
          logger.error(id, ':', error)
        }
        return (
          <InfoBar
            key={id}
            {...rest}
            isVisible
            buttonText={customAction ? customAction.name : 'dismiss'}
            button={{
              onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                if (customAction) {
                  customAction.action(event)
                }
                dispatch({
                  type: 'REMOVE_MESSAGE',
                  payload: { id } as RemoveMessagePayload,
                })
              },
            }}
          />
        )
      })}
    </>
  )
}

export default ErrorPanel
