'use strict';
import { Regression } from '../../tags';
import TestHelpers from '../../helpers';
import { loginToApp } from '../../viewHelper';
import FixtureBuilder from '../../fixtures/fixture-builder';
import {
  withFixtures,
  defaultGanacheOptions,
} from '../../fixtures/fixture-helper';
import TabBarComponent from '../../pages/TabBarComponent';
import { TestDApp } from '../../pages/TestDApp';
import { SMART_CONTRACTS } from '../../../app/util/test/smart-contracts';
import root from '../../../locales/languages/en.json';
import ApprovalModal from '../../pages/modals/ApprovalModal';

const HST_CONTRACT = SMART_CONTRACTS.HST;
const WEBVIEW_TEST_DAPP_APPROVE_TOKENS_BUTTON_ID = 'approveTokens';

describe(Regression('ERC20 tokens'), () => {
  beforeAll(async () => {
    jest.setTimeout(170000);
    if (device.getPlatform() === 'android') {
      await TestHelpers.reverseServerPort();
    }
  });

  it('approve custom ERC20 token amount from a dapp', async () => {
    await withFixtures(
      {
        dapp: true,
        fixture: new FixtureBuilder()
          .withGanacheNetwork()
          .withPermissionControllerConnectedToTestDapp()
          .build(),
        restartDevice: true,
        ganacheOptions: defaultGanacheOptions,
        smartContract: HST_CONTRACT,
      },
      async ({ contractRegistry }) => {
        const hstAddress = await contractRegistry.getContractAddress(
          HST_CONTRACT,
        );
        await loginToApp();
        // Navigate to the browser screen
        await TabBarComponent.tapBrowser();

        // Approve ERC20 tokens
        await TestDApp.tapButtonWithContract({
          buttonId: WEBVIEW_TEST_DAPP_APPROVE_TOKENS_BUTTON_ID,
          contractAddress: hstAddress,
        });

        //Input custom token amount
        await TestHelpers.checkIfExists(ApprovalModal.APPROVE_TOKEN_AMOUNT);
        await TestHelpers.typeTextAndHideKeyboard(
          ApprovalModal.APPROVE_TOKEN_AMOUNT,
          '2',
        );

        // Assert that custom token amount is shown
        ApprovalModal.assertTokenAmountIsShown('2');

        // Tap next button
        await TestHelpers.checkIfElementWithTextIsVisible(
          root.transaction.next,
        );
        await TestHelpers.tapByText(root.transaction.next);

        // Tap approve button
        await TestHelpers.checkIfElementWithTextIsVisible(
          root.transactions.tx_review_approve,
        );
        await ApprovalModal.tapApproveButton();

        // Navigate to the activity screen
        await TabBarComponent.tapActivity();

        // Assert erc20 is approved
        await TestHelpers.checkIfElementByTextIsVisible(
          root.transaction.confirmed,
        );
      },
    );
  });
});
