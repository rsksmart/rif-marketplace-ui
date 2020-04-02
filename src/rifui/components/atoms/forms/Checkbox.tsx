import React, { FC, useState } from 'react';
import {
	Checkbox as MUICheckbox,
	CheckboxProps as MUICheckboxProps,
	makeStyles,
	createStyles,
	Theme
} from '@material-ui/core';
import { CheckBoxOutlineBlankSharp, CheckBoxSharp } from '@material-ui/icons';
import { colors } from 'rifui/theme';

export interface CheckboxProps extends MUICheckboxProps { };

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		unCheckedIcon: {
			color: colors.gray4
		},
		checkedIcon: {
			color: colors.primary,
		}
	})
);

const Checkbox: FC<CheckboxProps> = props => {

	const classes = useStyles();
	const [checked, setChecked] = useState(!!props.checked);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	}

	return (
		<MUICheckbox
			checkedIcon={
				<CheckBoxSharp className={classes.checkedIcon} />
			}
			icon={
				<CheckBoxOutlineBlankSharp className={classes.unCheckedIcon} />
			}
			{...props}
			checked={checked}
			onChange={handleChange} />
	);
}

export default Checkbox;
