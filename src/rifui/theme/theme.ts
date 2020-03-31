import {
  createMuiTheme
} from '@material-ui/core/styles';

const globalProperties = {
  colors: {
    primary: '#008FF7',
    gray: '#919191'
  },
  fonts: {
    fontFamily: 'Rubik',
    fontSizeNormal: 14,
    fontSizeMedium: 16,
  }
}

const theme = createMuiTheme({
  palette: {
    primary: {
      main: globalProperties.colors.primary,
    },
    // secondary: {
    //   main: globalProperties.colors.gray
    // }
  },
  typography: {
    fontFamily: globalProperties.fonts.fontFamily,
    fontSize: globalProperties.fonts.fontSizeNormal,
  },
  props: {
    MuiCheckbox: {
      style: {
        color: globalProperties.colors.primary
      }
    },
    MuiLink: {
      style: {

      }
    },
    MuiExpansionPanel: {
      style: {
        color: globalProperties.colors.gray,
        fontSize: globalProperties.fonts.fontSizeNormal,
        fontWeight: 500,
      }
    },
    MuiExpansionPanelDetails: {
      style: {
      }
    },
    MuiExpansionPanelSummary: {
      style: {
        borderBottom: `1px solid ${globalProperties.colors.gray}`
      }
    },
    MuiSwitch: {
      color: "primary",
      // style: {
      //   color: globalProperties.colors.primary,
      // }
    },
    MuiTypography: {
      style: {
      }
    }
  }
});

export default theme;