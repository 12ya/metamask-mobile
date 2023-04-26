import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import NavbarTitle from './';

const mockStore = configureMockStore();
const store = mockStore({});

describe('NavbarTitle', () => {
  it('should render correctly', () => {
    const title = 'Test';
    const network = {
      provider: {
        type: 'mainnet',
      },
    };
    const { toJSON } = render(
      <Provider store={store}>
        <NavbarTitle title={title} network={network} />
      </Provider>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
