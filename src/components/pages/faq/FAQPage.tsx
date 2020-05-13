import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Typography, colors } from '@rsksmart/rif-ui';
import FAQPageTemplate from '../../templates/FAQPageTemplate';
import FAQSection, { FAQSectionProps } from 'components/molecules/FAQSection';

// TODO:
// - update rif-ui accordion component
// - create FAQSection in rif-ui
export interface FAQPageProps {
  className?: string;
  mainTitle: string;
  questionsAndAnswers: FAQSectionProps[]
};

const faqProps: FAQPageProps = {
  mainTitle: 'Frequently Asked Questions',
  questionsAndAnswers: [{
    id: 'q1',
    question: 'Lorem ipsum dolor sit amet?',
    answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus suscipit turpis sed porta blandit.
     Sed porttitor fringilla erat, vel maximus mauris rhoncus non. Cras dignissim gravida sem et accumsan. 
     Cras a turpis convallis, consequat massa scelerisque, tristique magna. Donec sagittis est quis interdum malesuada. 
     Suspendisse eleifend, quam varius semper lacinia.`,
    initiallyExpanded: true
  },
  {
    id: 'q2',
    question: 'Lorem ipsum dolor sit amet?',
    answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus suscipit turpis sed porta blandit.
     Sed porttitor fringilla erat, vel maximus mauris rhoncus non. Cras dignissim gravida sem et accumsan. 
     Cras a turpis convallis, consequat massa scelerisque, tristique magna. Donec sagittis est quis interdum malesuada. 
     Suspendisse eleifend, quam varius semper lacinia.`
  },
  {
    id: 'q3',
    question: 'Lorem ipsum dolor sit amet?',
    answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus suscipit turpis sed porta blandit.
     Sed porttitor fringilla erat, vel maximus mauris rhoncus non. Cras dignissim gravida sem et accumsan. 
     Cras a turpis convallis, consequat massa scelerisque, tristique magna. Donec sagittis est quis interdum malesuada. 
     Suspendisse eleifend, quam varius semper lacinia.`
  },
  {
    id: 'q4',
    question: 'Lorem ipsum dolor sit amet?',
    answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus suscipit turpis sed porta blandit.
     Sed porttitor fringilla erat, vel maximus mauris rhoncus non. Cras dignissim gravida sem et accumsan. 
     Cras a turpis convallis, consequat massa scelerisque, tristique magna. Donec sagittis est quis interdum malesuada. 
     Suspendisse eleifend, quam varius semper lacinia.`
  },
  {
    id: 'q5',
    question: 'Lorem ipsum dolor sit amet?',
    answer: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus suscipit turpis sed porta blandit.
     Sed porttitor fringilla erat, vel maximus mauris rhoncus non. Cras dignissim gravida sem et accumsan. 
     Cras a turpis convallis, consequat massa scelerisque, tristique magna. Donec sagittis est quis interdum malesuada. 
     Suspendisse eleifend, quam varius semper lacinia.`
  }
  ]
}

const useStyles = makeStyles((theme: Theme) => ({
  mainTitle: {
    fontSize: theme.typography.pxToRem(50),
    margin: theme.spacing(2, 0),
  },
  questionsSection: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2),
  },
  grayBackground: {
    backgroundColor: colors.gray1
  }
}));

const FAQPage = ({ className = '' }) => {
  const classes = useStyles();
  return (
    <FAQPageTemplate className={className}>
      <Typography className={classes.mainTitle} variant='h1' color='primary'>{faqProps.mainTitle}</Typography>
      <div className={classes.questionsSection}>
        {
          faqProps.questionsAndAnswers.map((qAndA: FAQSectionProps, i) => (
            <FAQSection className={`${i % 2 === 0 ? classes.grayBackground : ''}`} key={`faq-${i}`} id={`faq-${i}`} {...qAndA} />
          ))
        }
      </div>
    </FAQPageTemplate>
  );
};

export default FAQPage;
