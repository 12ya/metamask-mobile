import Engine from '../core/Engine';
import { BNToHex } from '../util/number';
import Logger from '../util/Logger';
import ExtendedKeyringTypes from '../../app/constants/keyringTypes';

const ZERO_BALANCE = '0x0';
const MAX = 20;

/**
 * Get an account balance from the network.
 * @param {string} address - The account address
 * @param {EthQuery} ethQuery - The EthQuery instance to use when asking the network
 */
const getBalance = async (address, ethQuery) =>
  new Promise((resolve, reject) => {
    ethQuery.getBalance(address, (error, balance) => {
      if (error) {
        reject(error);
        Logger.error(error);
      } else {
        const balanceHex = BNToHex(balance);
        resolve(balanceHex || ZERO_BALANCE);
      }
    });
  });

/**
 * Add additional accounts in the wallet based on balance
 */
export default async () => {
  const { KeyringController } = Engine.context;
  const ethQuery = Engine.getGlobalEthQuery();

  await KeyringController.withKeyring(
    { type: ExtendedKeyringTypes.hd },
    async (primaryKeyring) => {
      let i = 0;
      while (i < MAX) {
        const [newAccount] = await primaryKeyring.addAccounts(1);

        let newAccountBalance;
        try {
          newAccountBalance = await getBalance(newAccount, ethQuery);
        } catch (error) {
          // Errors are gracefully handled so that `withKeyring`
          // will not rollback the primary keyring, and accounts
          // created in previous loop iterations will remain in place.
          Logger.error(error);
          newAccountBalance = ZERO_BALANCE;
        }

        if (newAccountBalance === ZERO_BALANCE) {
          // remove extra zero balance account we just added and break the loop
          primaryKeyring.removeAccount(newAccount);
          break;
        }

        i++;
      }
    },
  );
};
