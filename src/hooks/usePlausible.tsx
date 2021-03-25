import { useEffect } from 'react'

export type UsePlausibleProps = {
  activated: boolean
  dataDomain: string
}

const PLAUSIBLE_URL = 'https://plausible.io/js/plausible.js'

const usePlausible = (
  { activated, dataDomain }: UsePlausibleProps,
): void => {
  useEffect(() => {
    if (activated) {
      const script = document.createElement('script')

      script.setAttribute('src', PLAUSIBLE_URL)
      script.setAttribute('async', 'true')
      script.setAttribute('data-domain', dataDomain)

      document.head.appendChild(script)
    }
  }, [activated, dataDomain])
}

export default usePlausible
