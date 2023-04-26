import React from 'react';
import TransactionDetails from './';
import configureMockStore from 'redux-mock-store';
import { render } from '@testing-library/react-native';
import { RPC } from '../../../../constants/network';
import { Provider } from 'react-redux';

const mockStore = configureMockStore();
const initialState = {
  engine: {
    backgroundState: {
      CurrencyRateController: {
        conversionRate: 2,
        currentCurrency: 'USD',
      },
      PreferencesController: {
        frequentRpcList: [],
      },
      NetworkController: {
        providerConfig: {
          rpcTarget: '',
          type: RPC,
        },
      },
    },
  },
};
const store = mockStore(initialState);

describe('TransactionDetails', () => {
  it('should render correctly', () => {
    const { toJSON } = render(
      <Provider store={store}>
        <TransactionDetails
          transactionObject={{
            networkID: '1',
            status: 'confirmed',
            transaction: {
              nonce: '',
            },
          }}
          transactionDetails={{
            renderFrom: '0x0',
            renderTo: '0x1',
            transactionHash: '0x2',
            renderValue: '2 TKN',
            renderGas: '21000',
            renderGasPrice: '2',
            renderTotalValue: '2 TKN / 0.001 ETH',
            renderTotalValueFiat: '',
          }}
        />
      </Provider>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
