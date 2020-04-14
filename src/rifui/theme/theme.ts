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
    transparent: '#FFFFFF00',
    white: '#FFFFFF'
};

export const fonts = {
    family: 'Rubik',
    size: {
        small: 10,
        normal: 14,
        medium: 16
    },
    weight: {
        normal: 300,
        lightBold: 500,
        bold: 700,
        superBold: 900
    }
}

const theme = createMuiTheme({
    palette: {
        primary: {
            main: colors.primary,
        },
        secondary: {
            main: colors.gray5
        }
    },
    typography: {
        fontFamily: fonts.family,
        button: {
            textTransform: 'none',
        }
    },
    props: {
    },
    overrides: {
    }
});

export default theme;