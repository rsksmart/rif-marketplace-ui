import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export interface ChevronProps {
  direction: string;
}

const chevronDirection = {
  down: faChevronDown,
  up: faChevronUp,
};

const Chevron = ({ direction, ...props }) => {
  return <FontAwesomeIcon icon={chevronDirection[direction]} {...props} />;
};

export default Chevron;
