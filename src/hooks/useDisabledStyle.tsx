import { makeStyles, Theme } from '@material-ui/core/styles'

const useDisabledStyle = makeStyles(({ palette }: Theme) => ({
  root: {
    '& *': {
      color: palette.text.disabled,
    },
  },
}))

export default useDisabledStyle
