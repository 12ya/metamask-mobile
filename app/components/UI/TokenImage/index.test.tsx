import React from 'react';
import { render } from '@testing-library/react-native';
import TokenImage from './';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';

const mockStore = configureMockStore();
const initialState = {
  engine: {
    backgroundState: {
      SwapsController: {
        tokens: [],
      },
      TokenListController: {
        tokenList: {},
      },
    },
  },
  settings: {
    primaryCurrency: 'usd',
  },
};
const store = mockStore(initialState);

describe('TokenImage', () => {
  it('should render correctly', () => {
    const { toJSON } = render(
      <Provider store={store}>
        <TokenImage
          asset={{
            address: '0x123',
            symbol: 'ABC',
            decimals: 18,
            image: 'invalid-uri',
          }}
        />
      </Provider>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
