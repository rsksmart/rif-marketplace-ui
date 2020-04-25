import React, { FC, useState } from 'react';
import {
	Checkbox as MUICheckbox,
	CheckboxProps as MUICheckboxProps,
	makeStyles,
	createStyles
} from '@material-ui/core';
import { CheckBoxOutlineBlankSharp, CheckBoxSharp } from '@material-ui/icons';
import { colors } from '../../../theme';

export interface CheckboxProps extends MUICheckboxProps { };

const useStyles = makeStyles(() =>
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
	const [isChecked, setIsChecked] = useState(!!props.checked);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void => {
		setIsChecked(checked);

		const { onChange } = props;
		!!onChange && onChange(event, checked);
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
			checked={isChecked}
			onChange={handleChange} />
	);
}

export default Checkbox;
