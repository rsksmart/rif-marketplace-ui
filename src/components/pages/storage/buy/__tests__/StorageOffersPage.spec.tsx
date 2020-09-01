// const FAKE_BILLING_PLAN: BillingPlan[] = [
//   {
//     currency: 'RBTC',
//     period: subscriptionPeriods[TimeInSeconds.DAY],
//     price: Big(10 ** 18),
//   },
// ]

// const FAKE_OFFER_0: StorageOffer = {
//   availableSize: Big(3000),
//   id: 'fake_id',
//   location: 'fake_location',
//   averagePrice: Big(10 ** 18),
//   system: 'fake_system',
//   subscriptionOptions: FAKE_BILLING_PLAN,
// }

// const FAKE_LISTING: StorageOffer[] = [FAKE_OFFER_0]

// const FAKE_RATE = 12288.79
// const FAKE_CURRENCY = 'CSK'

// interface Headers extends TableHeaders {
//   provider: 'Provider'
//   system: string
//   availableSize: 'Available Size'
//   subscriptionOptions: 'Subscription Period'
//   averagePrice: 'Price/GB/Day'
//   action1: ''
// }
// const tableHeaders: Headers = {
//   provider: 'Provider',
//   system: 'System',
//   availableSize: 'Available Size',
//   subscriptionOptions: 'Subscription Period',
//   averagePrice: 'Price/GB/Day',
//   action1: '',
// }

// type Items = Modify<Headers, {
//   id: string
//   provider: string
//   system: string
//   availableSize: string
//   subscriptionOptions: string
//   averagePrice: React.ReactElement<CombinedPriceCellProps>
//   action1: 'your offer' | React.ReactElement<SelectRowButtonProps>
// }>

// jest.mock('components/templates/MarketPageTemplate', () => {
//   const FakeComponent: FC<Partial<{
//     itemCollection: Items
//     headers: TableHeaders
//   }>> = ({ itemCollection, headers }) => (
//     <>
//       <div data-testid="itemCollection">{JSON.stringify(itemCollection)}</div>
//       <div data-testid="headers">{JSON.stringify(headers)}</div>
//     </>
//   )
//   return FakeComponent
// })

// const renderOffers = () => {
//   const fakeStorageContextValue = {
//     state: {
//       listing: {
//         items: FAKE_LISTING,
//         outdatedTokens: [],
//       },
//     },
//   }
// const fakeMarketContextValue = {
//   state: {
//     exchangeRates: {
//       currentFiat: {
//         displayName: FAKE_CURRENCY,
//         symbol: 'usd',
//       },
//       crypto: {
//         rbtc: {
//           displayName: 'RBTC',
//           rate: FAKE_RATE,
//         },
//       },
//     },
//   },
// }

// return render(
//   <MarketStoreProvider>
//     <StorageOffersContext.Provider value={fakeStorageContextValue}>
//       <StorageOffersPage />
//     </StorageOffersContext.Provider>
//   </MarketStoreProvider>,
// )
// }

describe('StorageOffersPage', () => {
  test.todo('should render MarketPageTemplate with correct headers props') // , () => {
  // const { getByTestId } = renderOffers()
  // const mockedInnerComp = getByTestId('headers')

  // expect(mockedInnerComp).not.toBeUndefined()

  // const expectedValue = JSON.stringify(tableHeaders)
  // const actualValue = mockedInnerComp.innerHTML

  // expect(actualValue).toEqual(expectedValue)
  // })

  test.todo('should render MarketPageTemplate with correct itemCollection props') // , () => {
  // const { getByTestId } = renderOffers()
  // const mockedInnerComp = getByTestId('itemCollection')

  // expect(mockedInnerComp).not.toBeUndefined()
  // const {
  //   id, system, availableSize, subscriptionOptions, averagePrice,
  // } = FAKE_OFFER_0
  // const expectedValue = JSON.stringify([
  //   {
  //     id,
  //     provider: id,
  //     system,
  //     availableSize: availableSize.toString(),
  //     subscriptionOptions: subscriptionOptions.map((plan: BillingPlan) => plan.period)
  //       .reduce((lastWord, currentWord) => `${lastWord} - ${currentWord}`),
  //     averagePrice: <CombinedPriceCell
  //       price={averagePrice.toString()}
  //       priceFiat={averagePrice.times(FAKE_RATE).toString()}
  //       currency={subscriptionOptions[0].currency}
  //       currencyFiat={FAKE_CURRENCY}
  //       divider="\n"
  //     />,
  //     action1: <SelectRowButton
  //       id={id}
  //       handleSelect={jest.fn()}
  //     />,
  //   },
  // ])
  // const actualValue = mockedInnerComp.innerHTML

  // expect(actualValue).toEqual(expectedValue)
  // })
})

export default {}
