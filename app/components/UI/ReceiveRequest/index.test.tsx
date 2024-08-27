import { cloneDeep } from 'lodash';
import ReceiveRequest from './';
import { renderScreen } from '../../../util/test/renderWithProvider';
import { backgroundState } from '../../../util/test/initial-root-state';
import { MOCK_ACCOUNTS_CONTROLLER_STATE } from '../../../util/test/accountsControllerTestUtils';

const initialState = {
  engine: {
    backgroundState: {
      ...backgroundState,
      AccountsController: MOCK_ACCOUNTS_CONTROLLER_STATE,
    },
  },
  fiatOrders: {
    networks: [
      {
        active: true,
        chainId: 1,
        nativeTokenSupported: true,
      },
    ],
  },
};

jest.mock('../../../util/address', () => ({
  ...jest.requireActual('../../../util/address'),
  renderAccountName: jest.fn(),
}));

jest.mock('react-native-share', () => ({
  open: jest.fn(),
}));

jest.mock('../../../core/ClipboardManager', () => ({
  setString: jest.fn(),
}));

describe('ReceiveRequest', () => {
  it('render matches snapshot', () => {
    const { toJSON } = renderScreen(
      ReceiveRequest,
      { name: 'ReceiveRequest' },
      { state: initialState },
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('render correctly with different ticker', () => {
    const state = cloneDeep(initialState);
    state.engine.backgroundState.NetworkController.providerConfig.ticker =
      'DIFF';
    const { toJSON } = renderScreen(
      ReceiveRequest,
      { name: 'ReceiveRequest' },
      { state },
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it('render correctly without buy', () => {
    const state = {
      ...initialState,
      fiatOrders: undefined,
    };
    const { toJSON } = renderScreen(
      ReceiveRequest,
      { name: 'ReceiveRequest' },
      { state },
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
