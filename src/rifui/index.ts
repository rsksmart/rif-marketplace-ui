// CSS files
import './css/style.css';

import Accordion from './components/Accordion';
import Checkbox, { ICheckboxProps as a_ICheckboxProps } from './components/forms/Checkbox';
import FormControl from './components/forms/FormControl';
import FormControlLabel, { IFormControlLabelProps as a_IFormControlLabelProps } from './components/forms/FormControlLabel';
import FormGroup from './components/forms/FormGroup';
import Logo from './Logo';
import LogoFooter from './LogoFooter';
import LogoNavbar from './LogoNavbar';
import RangeSlider from './components/RangeSlider';
import TextField, { TextFieldProps as a_TextFieldProps } from './components/forms/TextField';

// Types
// .ito - workaround to re-export types
// source: https://stackoverflow.com/questions/53444390/how-to-create-a-package-with-the-isolatedmodules-true-option-enabled
export type ICheckboxProps = a_ICheckboxProps;
export type IFormControlLabelProps = a_IFormControlLabelProps;
export type TextFieldProps = a_TextFieldProps;

// Components
export {
    Accordion,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    Logo,
    LogoFooter,
    LogoNavbar,
    RangeSlider,
    TextField
};