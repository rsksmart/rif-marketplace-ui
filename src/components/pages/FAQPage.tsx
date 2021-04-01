import React, { FC } from 'react'
/* eslint-disable-next-line import/no-unresolved */
import PrivacySettingsModal from 'components/organisms/tracking/PrivacySettingsModal'
import FAQPageTemplate, { FAQPageTemplateProps } from 'components/templates/FAQPageTemplate'

export interface FAQPageProps {
  className?: string
}

const FAQPage: FC<{}> = () => {
  const faqTemplateProps: FAQPageTemplateProps = {
    mainTitle: 'Frequently Asked Questions',
    questionsAndAnswers: [
      {
        question: 'What is the RIF Marketplace?',
        answer: 'RIF Marketplace provides a one-stop shop for a wide variety of decentralized services, presenting at the same time a common unified/simplified interface and user experience.  The RIF Marketplace allows Service Providers and Consumers to meet and engage in a secure and efficient way, includes staking, reputation, and slashing mechanisms, to ensure all parties fulfill their obligations as expected. ',
        initiallyExpanded: false,
      },
      {
        question: 'Which services are you planning to offer in the RIF Marketplace?',
        answer: `We plan to cover a wide range of services including Buying and Selling RNS Domains, Storage Services, Data Services (Oracles),
   Payments Services (Watchtowers), Trigger Services, Scheduling Services, Metatransaction providers (Gas Stations), and Notarization/Timestamping services, among others.`,
        initiallyExpanded: false,
      },
      {
        question: 'How do you compare to other Marketplaces?',
        answer: `Currently there are no decentralized Marketplaces that cover the variety of services we offer in the RIF Marketplace and that simplify access and consumption of these services as we do, providing a one-stop-shop to access all the required services to build decentralized applications and systems.
    .`,
      },
      {
        question: 'What are the main characteristics of the RIF Marketplace?',
        answer: `The main features of the RIF Marketplace include: 
    A) Decentralization  (including all the benefits associated such as security, transparency, censorship resistance, immutability and self-owned reputation, etc). 
    B) Wide range of services  (we cover all the required building blocks for developers to build Decentralized applications and systems including Storage, Communications, Payments, Data Services, and Meta-transactions).
    C) Unified and Simplified interface: We have a strong focus in the end-user making it simple for them to consume the services and providing a unified and simplified interface to access multiple providers and technologies in each of the service categories.`,
      },
      {
        question: 'How does it fit in with the rest of the RIF/RSK ecosystem and the DeFi ecosystem?',
        answer: `The RIF Marketplace is the heart of the RIF economy and will be the entry/access point to most of the RIF services such as Storage, Communications, Data Services, etc. Providers of the different RIF services will be able to list their offerings in the RIF Marketplace and engage with users/consumers in a secure and efficient way. 
    At the same time the DeFi ecosystem will surely require services from the RIF Marketplace and allowing a seamless and efficient integration will be extremely important for any company, partner, or developer that wants to build a solution on top of the RSK/RIF suite of technologies.`,
      },
      {
        question: 'What is the Roadmap for the RIF Marketplace in the short term?',
        answer: `We released the first version of the RIF Marketplace which allows users to Buy/Sell 
      RNS Domains (Name Services). The next step is to add Storage Services (Renting Decentralized Storage) 
      and Data Services (Oracles and external data sources). We also plan to incorporate soon the staking, slashing, SLA, reputation and dispute resolution mechanisms.`,
      },
      {
        question: 'What are the long terms plans for the RIF Marketplace?',
        answer: 'In the long term we expect the RIF Marketplace not only to be one of the main sources for users and developers to access decentralized services, but also serve as the cornerstone and base for the creation/development of other decentralized marketplaces for many different use cases. The RIF Marketplace aims to be in the long term the foundation of multiple projects that would bring us closer to a more decentralized, inclusive, and fair world such as the one we envision in RIF.',
      },
    ],
  }

  return (
    <>
      <PrivacySettingsModal />
      <FAQPageTemplate
        {...faqTemplateProps}
      />
    </>
  )
}

export default FAQPage
