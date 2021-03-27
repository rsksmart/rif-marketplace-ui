import { TRACKING_URL } from 'config'
import { useEffect } from 'react'

export type Props = {
  activated: boolean
  dataDomain: string
}

const useTracking = (
  { activated, dataDomain }: Props,
): void => {
  useEffect(() => {
    if (activated) {
      const script = document.createElement('script')

      script.setAttribute('src', TRACKING_URL)
      script.setAttribute('async', 'true')
      script.setAttribute('data-domain', dataDomain)

      document.head.appendChild(script)
    }
  }, [activated, dataDomain])
}

export default useTracking
