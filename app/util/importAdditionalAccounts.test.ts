import importAdditionalAccounts from './importAdditionalAccounts';
import { BN } from 'ethereumjs-util';

const mockKeyring = {
  addAccounts: jest.fn(),
  removeAccount: jest.fn(),
};

const mockEthQuery = {
  getBalance: jest.fn(),
};

jest.mock('../core/Engine', () => ({
  context: {
    KeyringController: {
      withKeyring: jest.fn((_keyring, callback) => callback(mockKeyring)),
    },
  },
  getGlobalEthQuery: () => mockEthQuery,
}));

/**
 * Set the balance that will be queried for the account
 *
 * @param balance - The balance to be queried
 */
function setQueriedBalance(balance: BN) {
  mockEthQuery.getBalance.mockImplementation((_, callback) =>
    callback(balance),
  );
}

/**
 * Set the balance that will be queried for the account once
 *
 * @param balance - The balance to be queried
 */
function setQueriedBalanceOnce(balance: BN) {
  mockEthQuery.getBalance.mockImplementationOnce((_, callback) =>
    callback(balance),
  );
}

describe('importAdditionalAccounts', () => {
  describe('when there is no account with balance', () => {
    it('should not add any account', async () => {
      setQueriedBalance(new BN(0));
      mockKeyring.addAccounts.mockResolvedValue(['0x1234']);

      await importAdditionalAccounts();

      expect(mockKeyring.addAccounts).toHaveBeenCalledTimes(1);
      expect(mockKeyring.removeAccount).toHaveBeenCalledTimes(1);
      expect(mockKeyring.removeAccount).toHaveBeenCalledWith('0x1234');
    });
  });

  describe('when there is an account with balance', () => {
    it('should add 1 account', async () => {
      setQueriedBalanceOnce(new BN(1));
      setQueriedBalanceOnce(new BN(0));
      mockKeyring.addAccounts
        .mockResolvedValueOnce(['0x1234'])
        .mockResolvedValueOnce(['0x5678']);

      await importAdditionalAccounts();

      expect(mockKeyring.addAccounts).toHaveBeenCalledTimes(2);
      expect(mockKeyring.removeAccount).toHaveBeenCalledWith('0x5678');
    });
  });
});
