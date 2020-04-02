import {
	createMuiTheme
} from '@material-ui/core/styles';

export const colors = {
	primary: '#008FF7',
	gray: '#919191',
	lightGray: '#C4C4C4',
	superLightGray: '#E5E5E5'
};

export const fonts = {
	fontFamily: 'Rubik',
	fontSizeSmall: 10,
	fontSizeNormal: 14,
	fontSizeMedium: 16,
}

const theme = createMuiTheme({
	palette: {
		primary: {
			main: colors.primary,
		},
		secondary: {
			main: colors.gray
		}
	},
	typography: {
		// TODO: install the font
		// fontFamily: fonts.fontFamily,
		fontSize: fonts.fontSizeNormal,
	},
	props: {
		// MuiSvgIcon: {
		// 	style: {
		// 		color: colors.gray
		// 	}
		// },
		MuiCheckbox: {
			style: {
				color: colors.primary
			}
		},
		MuiExpansionPanel: {
			style: {
				// color: colors.gray,
				fontSize: fonts.fontSizeNormal,
				fontWeight: 500,
			}
		},
		MuiExpansionPanelDetails: {
			style: {
			}
		},
		MuiExpansionPanelSummary: {
			style: {
				borderBottom: `1px solid ${colors.superLightGray}`
			}
		},
		MuiLink: {
			style: {
			}
		},
		MuiSwitch: {
			color: "primary",
			// style: {
			//   color: colors.primary,
			// }
		},
		MuiTypography: {
			style: {
			}
		}
	},
	// overrides: {
	// 	MuiCheckbox: {
	// 		colorSecondary: {
	// 			color: colors.primary,
	// 			'&$checked': {
	// 				color: colors.primary,
	// 			},
	// 		},
	// 	}
	// }
});

export default theme;