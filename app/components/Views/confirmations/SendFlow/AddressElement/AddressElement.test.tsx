import React from 'react';
import renderWithProvider from '../../../../../util/test/renderWithProvider';

import AddressElement from '.';
import { renderShortAddress } from '../../../../../util/address';
import { backgroundState } from '../../../../../util/test/initial-root-state';

jest.unmock('react-redux');

jest.mock('../../../../../core/Engine', () => ({
  context: {
    NetworkController: {
      getProviderAndBlockTracker: jest.fn().mockImplementation(() => ({
        provider: {
          sendAsync: () => null,
        },
      })),
      getNetworkClientById: () => ({
        configuration: {
          chainId: '0x1',
        },
      }),
      state: {
        networkConfigurations: {
          mainnet: {
            id: 'mainnet',
            rpcUrl: 'https://mainnet.infura.io/v3',
            chainId: '0x1',
            ticker: 'ETH',
            nickname: 'Ethereum mainnet',
            rpcPrefs: {
              blockExplorerUrl: 'https://etherscan.com',
            },
          },
        },
        selectedNetworkClientId: 'mainnet',
        networkMetadata: {},
      },
    },
    KeyringController: {
      state: {
        keyrings: [],
      },
    },
  },
}));

const initialState = {
  engine: {
    backgroundState,
  },
};

// TODO: Replace "any" with type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderComponent = (state: any) =>
  renderWithProvider(
    <AddressElement
      address={'0xd018538C87232FF95acbCe4870629b75640a78E7'}
      onAccountPress={() => null}
      onAccountLongPress={() => null}
      onIconPress={() => null}
      testID="address-element"
    />,
    { state },
  );

describe('AddressElement', () => {
  it('should render correctly', () => {
    const { toJSON } = renderComponent(initialState);
    expect(toJSON()).toMatchSnapshot();
  });

  it('should render the address', () => {
    const address = '0xd018538C87232FF95acbCe4870629b75640a78E7';
    const { getByText } = renderComponent(initialState);
    const addressText = getByText(renderShortAddress(address));
    expect(addressText).toBeDefined();
  });
});
