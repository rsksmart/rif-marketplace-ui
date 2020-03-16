import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const CaretDownIcon = ({ ...props }) => {
  return <FontAwesomeIcon icon={faCaretDown} {...props} />;
};

export default CaretDownIcon;
