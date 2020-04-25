import { createMuiTheme } from '@material-ui/core/styles';
import '../assets/css/fonts/rubik.css';

export const colors = {
    black: '#000000',
    primary: '#008FF7',
    darkBlue: '#197DC6',
    gray1: '#F8F7F7',
    gray2: '#E5E5E5',
    gray3: '#C4C4C4',
    gray4: '#919191',
    gray5: '#4D4C4C',
    gray6: '#15171B',
    transparent: '#FFFFFF00',
    white: '#FFFFFF'
};

export const fonts = {
    family: 'Rubik',
    size: {
        tiny: 10,
        small: 12,
        normal: 14,
        medium: 16
    },
    weight: {
        normal: 300,
        lightBold: 500,
        bold: 700,
        superBold: 900
    }
};

const theme = createMuiTheme({
    palette: {
        primary: {
            main: colors.primary,
        },
        secondary: {
            main: colors.gray4
        },
    },
    typography: {
        fontFamily: fonts.family,
        button: {
            textTransform: 'none',
        },
        fontWeightRegular: fonts.weight.normal,
    },
    props: {
    },
    overrides: {
        MuiButton: {
            root: {
                fontWeight: fonts.weight.normal,
            }
        }
    }
});

export default theme;