import React from 'react';
import renderWithProvider from '../../../util/test/renderWithProvider';
import Tabs from './';
import { backgroundState } from '../../../util/test/initial-root-state';
import { MOCK_ACCOUNTS_CONTROLLER_STATE } from '../../../util/test/accountsControllerTestUtils';
import mockedEngine from '../../../core/__mocks__/MockedEngine';

const mockInitialState = {
  wizard: {
    step: 1,
  },
  engine: {
    backgroundState: {
      ...backgroundState,
      AccountsController: MOCK_ACCOUNTS_CONTROLLER_STATE,
    },
  },
};

jest.mock('react-native-safe-area-context', () => {
  const inset = { top: 1, right: 2, bottom: 3, left: 4 };
  return {
    SafeAreaInsetsContext: {
      Consumer: jest.fn().mockImplementation(({ children }) => children(inset)),
    },
  };
});

jest.mock('../../../core/Engine', () => ({
  init: () => mockedEngine.init(),
}));

describe('Tabs', () => {
  it('should render correctly', () => {
    const { toJSON } = renderWithProvider(
      <Tabs tabs={[{ id: 1, url: 'about:blank', image: '' }]} />,
      { state: mockInitialState },
    );
    expect(toJSON()).toMatchSnapshot();
  });
});
