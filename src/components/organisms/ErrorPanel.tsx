import InfoBar from 'components/molecules/InfoBar'
import React, { useContext } from 'react'
import AppStore, { AppStoreProps, MessageId } from 'store/App/AppStore'
import Logger from 'utils/Logger'

const logger = Logger.getInstance()

const ErrorPanel = () => {
  const {
    state: {
      messages,
    }, dispatch,
  }: AppStoreProps = useContext(AppStore)

  return (
    <>
      {Object.keys(messages).map((id: MessageId) => {
        const { customAction, ...rest } = messages[id]

        logger.error(`${id}: ${rest.text}`)
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
                  payload: { id } as any, // TODO: any
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
