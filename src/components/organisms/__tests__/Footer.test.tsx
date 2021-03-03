import React from 'react'
import { render } from '@testing-library/react'
import { appVersion } from 'config'
import Footer from '../Footer'

describe('Footer organism', () => {
  describe('section Developer: links', () => {
    describe('Version', () => {
      const versionTitle = `Version ${appVersion}`
      const versionLink = `https://github.com/rsksmart/rif-marketplace-ui/releases/tag/${appVersion}`
      
      test(`should have title ${versionTitle}`, () => {
        const { getByText } = render(<Footer />)
        expect(getByText(versionTitle)).toBeTruthy()
      })

      test(`should link to "${versionLink}"`, () => {
        const { getByText } = render(<Footer />)
        const linkTag: HTMLAnchorElement = getByText(versionTitle) as HTMLAnchorElement

        expect(linkTag?.href).toBeTruthy()
        expect(linkTag?.href).toBe(versionLink)
      })
    })
  })
})
