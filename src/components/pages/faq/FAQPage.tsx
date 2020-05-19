import React, { FC } from 'react'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Typography, colors } from '@rsksmart/rif-ui'
import FAQSection, { FAQSectionProps } from 'components/molecules/FAQSection'
import { FAQPageTemplate } from '@rsksmart/rif-ui';

// TODO:
// - create FAQSection in rif-ui
export interface FAQPageProps {
  className?: string
  mainTitle: string
  questionsAndAnswers: FAQSectionProps[]
}

const faqProps: FAQPageProps = {
  mainTitle: 'Frequently Asked Questions',
  questionsAndAnswers: [
    {
      id: 'q1',
      question: 'What is the RIF Marketplace?',
      answer: 'RIF Marketplace provides a one-stop shop for a wide variety of decentralized services, presenting at the same time a common unified/simplified interface and user experience.  The RIF Marketplace allows Service Providers and Consumers to meet and engage in a secure and efficient way, includes staking, reputation, and slashing mechanisms, to ensure all parties fulfill their obligations as expected. ',
      initiallyExpanded: true,
    },
    {
      id: 'q2',
      question: 'Which services are you planning to offer in the RIF Marketplace?',
      answer: `We plan to cover a wide range of services including Buying and Selling RNS Domains, Storage Services, Data Services (Oracles),
   Payments Services (Watchtowers), Trigger Services, Scheduling Services, Metatransaction providers (Gas Stations), and Notarization/Timestamping services, among others.`,
      initiallyExpanded: false,
    },
    {
      id: 'q3',
      question: 'How do you compare to other Marketplaces?',
      answer: `Currently there are no decentralized Marketplaces that cover the variety of services we offer in the RIF Marketplace and that simplify access and consumption of these services as we do, providing a one-stop-shop to access all the required services to build decentralized applications and systems.
    .`,
    },
    {
      id: 'q4',
      question: 'What are the main characteristics of the RIF Marketplace?',
      answer: `The main features of the RIF Marketplace include: 
    A) Decentralization  (including all the benefits associated such as security, transparency, censorship resistance, immutability and self-owned reputation, etc). 
    B) Wide range of services  (we cover all the required building blocks for developers to build Decentralized applications and systems including Storage, Communications, Payments, Data Services, and Meta-transactions).
    C) Unified and Simplified interface: We have a strong focus in the end-user making it simple for them to consume the services and providing a unified and simplified interface to access multiple providers and technologies in each of the service categories.`,
    },
    {
      id: 'q5',
      question: 'How does it fit in with the rest of the RIF/RSK ecosystem and the DeFi ecosystem?',
      answer: `The RIF Marketplace is the heart of the RIF economy and will be the entry/access point to most of the RIF services such as Storage, Communications, Data Services, etc. Providers of the different RIF services will be able to list their offerings in the RIF Marketplace and engage with users/consumers in a secure and efficient way. 
    At the same time the DeFi ecosystem will surely require services from the RIF Marketplace and allowing a seamless and efficient integration will be extremely important for any company, partner, or developer that wants to build a solution on top of the RSK/RIF suite of technologies.`,
    },
    {
      id: 'q6',
      question: 'What is the Roadmap for the RIF Marketplace in the short term?',
      answer: `We are releasing the first version of the RIF Marketplace to the RSK Testnet in May 2020.  

    This version is accessible via web and includes two main service categories:
    RNS Domains (Buying and selling of RNS domains among users)
    Storage Pinning Services (Renting decentralized storage)
    
    The next step is to add additional services (Oracles coming soon!) and also to incorporate the staking, slashing, SLA, reputation and dispute resolution mechanisms to ensure all parties have a positive and reliable experience.`,

    },
    {
      id: 'q7',
      question: 'What are the long terms plans for the RIF Marketplace?',
      answer: 'In the long term we expect the RIF Marketplace not only to be one of the main sources for users and developers to access decentralized services, but also serve as the cornerstone and base for the creation/development of other decentralized marketplaces for many different use cases. The RIF Marketplace aims to be in the long term the foundation of multiple projects that would bring us closer to a more decentralized, inclusive, and fair world such as the one we envision in RIF.',
    },
  ],
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
    backgroundColor: colors.gray1,
  },
}))

const FAQPage: FC<{}> = () => {
  const classes = useStyles()
  return (
    <FAQPageTemplate>
      <Typography className={classes.mainTitle} variant="h1" color="primary">{faqProps.mainTitle}</Typography>
      <div className={classes.questionsSection}>
        {
          faqProps.questionsAndAnswers.map((qAndA: FAQSectionProps, i) => (
            <FAQSection className={`${i % 2 === 0 ? classes.grayBackground : ''}`} key={`faq-${qAndA.id}`} {...qAndA} />
          ))
        }
      </div>
    </FAQPageTemplate>
  )
}

export default FAQPage
