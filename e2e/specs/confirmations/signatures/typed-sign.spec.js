'use strict';
import Browser from '../../../pages/Browser/BrowserView';
import TabBarComponent from '../../../pages/TabBarComponent';
import { loginToApp } from '../../../viewHelper';
import SigningModal from '../../../pages/Browser/SigningModal';
import TestDApp from '../../../pages/Browser/TestDApp';
import FixtureBuilder from '../../../fixtures/fixture-builder';
import {
  withFixtures,
  defaultGanacheOptions,
} from '../../../fixtures/fixture-helper';
import { SmokeConfirmations } from '../../../tags';
import TestHelpers from '../../../helpers';
import Assertions from '../../../utils/Assertions';

describe(SmokeConfirmations('Typed Sign'), () => {
  beforeAll(async () => {
    jest.setTimeout(2500000);
    await TestHelpers.reverseServerPort();
  });

  it('should sign typed message', async () => {
    await withFixtures(
      {
        dapp: true,
        fixture: new FixtureBuilder()
          .withGanacheNetwork()
          .withPermissionControllerConnectedToTestDapp()
          .build(),
        restartDevice: true,
        ganacheOptions: defaultGanacheOptions,
      },
      async () => {
        await loginToApp();

        await TabBarComponent.tapBrowser();
        await Browser.navigateToTestDApp();

        await TestDApp.tapTypedSignButton();
        await Assertions.checkIfVisible(SigningModal.typedRequest);
        await SigningModal.tapCancelButton();
        await Assertions.checkIfNotVisible(SigningModal.typedRequest);
        await Assertions.checkIfNotVisible(SigningModal.personalRequest);

        await TestDApp.tapTypedSignButton();
        await Assertions.checkIfVisible(SigningModal.typedRequest);
        await SigningModal.tapSignButton();
        await Assertions.checkIfNotVisible(SigningModal.typedRequest);
        await Assertions.checkIfNotVisible(SigningModal.personalRequest);
      },
    );
  });
});
