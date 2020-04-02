import React, { FC, useState } from 'react';
import { Checkbox as MUICheckbox, CheckboxProps as MUICheckboxProps } from '@material-ui/core';
import { StopRounded, BorderAll } from '@material-ui/icons';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import { colors } from '../../../theme';

export interface CheckboxProps extends MUICheckboxProps { }

const Checkbox: FC<CheckboxProps> = props => {
	const [checked, setChecked] = useState(!!props.checked);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	}

	return (
		<MUICheckbox
			icon={
				<CheckBoxOutlineBlankOutlinedIcon style={{ color: colors.gray }} />
			}
			checkedIcon={
				<StopRounded stroke={colors.gray} stroke-width={1} style={{ color: colors.primary, border: `2px ${colors.gray}` }} />
			}
			{...props}
			checked={checked}
			onChange={handleChange} />
	);
}

export default Checkbox;
