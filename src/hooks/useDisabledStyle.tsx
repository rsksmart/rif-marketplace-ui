import { makeStyles, Theme } from '@material-ui/core'

const useDisabledStyle = makeStyles(({ palette }: Theme) => ({
  root: {
    '& *': {
      color: palette.text.disabled,
    },
  },
}))

export default useDisabledStyle
