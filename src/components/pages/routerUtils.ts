// eslint-disable-next-line import/no-unresolved
import { StyledNavTabProps } from '@rsksmart/rif-ui/dist/components/atoms/StyledNavTab'

export const buildTabs = (tabs: {
    label: string
    value: string
}[]): StyledNavTabProps[] => tabs.map(({ label, value }) => ({
  label,
  value,
  to: value,
}))

export default {}
