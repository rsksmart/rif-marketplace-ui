import React, { FC, useState } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Tab as MUITab, Tabs as MUITabs } from '@material-ui/core';

import { colors, fonts } from 'rifui/theme';

export interface SwitchTabsProps {
  label1: string;
  label2: string;
  value?: 0 | 1;
  onChange: (event: React.ChangeEvent<{}>, value: any) => void;
};

const a11yProps = (index: any) => {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: colors.white,
    minHeight: 20,
    width: '100%',
    border: `${colors.primary} solid 1px`,
    borderRadius: 50,
    overflow: 'hidden',
  },
  tabContainer: {
    minHeight: 20,
    width: '100%'
  },
  tab: {
    "&:hover": {
      color: colors.primary
    },
    borderRadius: 50,
    color: colors.gray3,
    maxWidth: '50%',
    minHeight: '100%',
    minWidth: '50%',
    outlineStyle: 'none',
    padding: 0,
    textTransform: 'capitalize',
    zIndex: 1,
    '&:focus': {
      outlineStyle: 'none'
    }
  },
  // shows the transition between tabs
  tabIndicator: {
    backgroundColor: colors.primary,
    borderRadius: 50,
    height: '100%',
  },
  tabSelected: {
    // the '!important' here is to override the on hover functionality when it's active
    backgroundColor: `${colors.primary} !important`,
    color: `${colors.white} !important`,
    fontWeight: fonts.weight.lightBold,
  }
}));

const SwitchTabs: FC<SwitchTabsProps> = ({ label1, label2, value: controlledValue, onChange }) => {
  const classes = useStyles();
  // const [value, setValue] = useState(controlledValue);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number): void => {
    // setValue(newValue);
    onChange(event, newValue);
  };

  const toggleSwitch = () => {
    // if (!controlledValue) setValue(value ? 0 : 1);
  }
  console.error('controlledValue:', controlledValue)
  // console.error('value:', value)

  return (
    <div className={classes.root}>
      <MUITabs
        aria-label="tabs switch"
        className={classes.tabContainer}
        onChange={handleChange}
        TabIndicatorProps={{
          className: classes.tabIndicator
        }}
        value={controlledValue}
        variant="fullWidth"
      >
        <MUITab
          {...a11yProps(0)}
          classes={{ selected: classes.tabSelected }}
          className={classes.tab}
          label={label1}
          onClick={toggleSwitch} />
        <MUITab
          {...a11yProps(1)}
          classes={{ selected: classes.tabSelected }}
          className={classes.tab}
          label={label2}
          onClick={toggleSwitch} />
      </MUITabs>
    </div>
  );
}

export default SwitchTabs;
