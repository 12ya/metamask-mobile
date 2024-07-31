'use strict';
import { SmokeAccounts } from '../../tags';
import WalletView from '../../pages/wallet/WalletView';
import { importWalletWithRecoveryPhrase } from '../../viewHelper';
import AccountListView from '../../pages/AccountListView.js';
import ImportAccountView from '../../pages/ImportAccountView';
import Assertions from '../../utils/Assertions';

describe(SmokeAccounts('Import account via private to wallet'), () => {
  // This key is for testing private key import only
  // I should NEVER hold any eth or token
  const TEST_PRIVATE_KEY =
    'cbfd798afcfd1fd8ecc48cbecb6dc7e876543395640b758a90e11d986e758ad1';

  beforeAll(async () => {
    jest.setTimeout(200000);
    await device.launchApp();
  });

  it('should import wallet and go to the wallet view', async () => {
    await importWalletWithRecoveryPhrase();
  });

  it('should be able to import account', async () => {
    await WalletView.tapIdenticon();
    await AccountListView.isVisible();
    await AccountListView.tapAddAccountButton();
    await AccountListView.tapImportAccountButton();
    await ImportAccountView.isVisible();
    // Tap on import button to make sure alert pops up
    await ImportAccountView.tapImportButton();
    await ImportAccountView.tapOKAlertButton();
    await ImportAccountView.enterPrivateKey(TEST_PRIVATE_KEY);
    await ImportAccountView.isImportSuccessSreenVisible();
    await ImportAccountView.tapCloseButtonOnImportSuccess();
    await AccountListView.swipeToDimssAccountsModal();
    await Assertions.checkIfVisible(WalletView.container);
    await Assertions.checkIfElementNotToHaveText(
      WalletView.accountName,
      'Account 1',
    );
  });
});
