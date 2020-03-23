import React, { FC } from 'react';
import {
  Accordion as BSAccordion,
  AccordionProps as BSAccordionProps,
  Card,
} from 'react-bootstrap';
import { ReplaceProps, BsPrefixProps } from 'react-bootstrap/helpers';
import Chevron from 'components/atoms/icons/Chevron';

export type AccordionProps = ReplaceProps<
  React.ElementType,
  BsPrefixProps<React.ElementType> & BSAccordionProps
>;

const Accordion: FC<AccordionProps> = ({ className, children }) => {
  return (
    <BSAccordion className={className} defaultActiveKey="0">
      <Card>
        <BSAccordion.Toggle
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 'unset',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '14px',
            lineHeight: '17px',
          }}
          as={Card.Header}
          eventKey="0"
        >
          {className}
          <Chevron
            direction="down"
            style={{
              margin: '2px 5px 2px 0',
            }}
          />
        </BSAccordion.Toggle>
        <BSAccordion.Collapse eventKey="0">
          <Card.Body>{children}</Card.Body>
        </BSAccordion.Collapse>
      </Card>
    </BSAccordion>
  );
};

export default Accordion;
