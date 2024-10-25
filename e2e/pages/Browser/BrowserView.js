import TestHelpers from '../../helpers';
import { TEST_DAPP_LOCAL_URL } from './TestDApp';
import {
  BrowserViewSelectorsIDs,
  BrowserViewSelectorsText,
  BrowserViewSelectorsXPaths,
} from '../../selectors/Browser/BrowserView.selectors';
import { AccountOverviewSelectorsIDs } from '../../selectors/AccountOverview.selectors';
import { BrowserURLBarSelectorsIDs } from '../../selectors/Browser/BrowserURLBar.selectors';
import Gestures from '../../utils/Gestures';
import Matchers from '../../utils/Matchers';

class Browser {
  get searchButton() {
    return Matchers.getElementByID(BrowserViewSelectorsIDs.SEARCH_BUTTON);
  }

  get tabsButton() {
    return Matchers.getElementByID(BrowserViewSelectorsIDs.TABS_BUTTON);
  }

  get browserScreenID() {
    return Matchers.getElementByID(BrowserViewSelectorsIDs.BROWSER_SCREEN_ID);
  }

  get addressBar() {
    return Matchers.getElementByID(BrowserViewSelectorsIDs.URL_INPUT);
  }
  get urlInputBoxID() {
    return Matchers.getElementByID(BrowserURLBarSelectorsIDs.URL_INPUT);
  }

  get clearURLButton() {
    return Matchers.getElementByID(BrowserURLBarSelectorsIDs.URL_CLEAR_ICON);
  }
  get backToSafetyButton() {
    return Matchers.getElementByText(
      BrowserViewSelectorsText.BACK_TO_SAFETY_BUTTON,
    );
  }

  get returnHomeButton() {
    return Matchers.getElementByText(BrowserViewSelectorsText.RETURN_HOME);
  }

  get homePageFavouritesTab() {
    return Matchers.getElementByXPath(
      BrowserViewSelectorsIDs.BROWSER_WEBVIEW_ID,
      BrowserViewSelectorsXPaths.FAVORITE_TAB,
    );
  }

  get testDappURLInFavouritesTab() {
    return device.getPlatform() === 'ios'
      ? Matchers.getElementByXPath(
          BrowserViewSelectorsIDs.BROWSER_WEBVIEW_ID,
          BrowserViewSelectorsXPaths.TEST_DAPP_LINK,
        )
      : Matchers.getElementByXPath(
          BrowserViewSelectorsIDs.BROWSER_WEBVIEW_ID,
          BrowserViewSelectorsXPaths.TEST_DAPP_TEXT,
        );
  }

  get networkAvatarButton() {
    return device.getPlatform() === 'ios'
      ? Matchers.getElementByID(BrowserViewSelectorsIDs.AVATAR_IMAGE)
      : Matchers.getElementByDescendant(
          AccountOverviewSelectorsIDs.ACCOUNT_BUTTON,
          BrowserViewSelectorsIDs.AVATAR_IMAGE,
        );
  }

  get tabsNumber() {
    return Matchers.getElementByID(BrowserViewSelectorsIDs.TABS_NUMBER);
  }

  get closeAllTabsButton() {
    return Matchers.getElementByID(BrowserViewSelectorsIDs.CLOSE_ALL_TABS);
  }

  get noTabsMessage() {
    return Matchers.getElementByID(BrowserViewSelectorsIDs.NO_TABS_MESSAGE);
  }

  async tapUrlInputBox() {
    await Gestures.waitAndTap(this.addressBar);
  }

  async tapBottomSearchBar() {
    await Gestures.waitAndTap(this.searchButton);
  }

  async tapOpenAllTabsButton() {
    await Gestures.waitAndTap(this.tabsButton);
  }

  async tapCloseTabsButton() {
    await Gestures.waitAndTap(this.closeAllTabsButton);
  }

  async tapNetworkAvatarButtonOnBrowser() {
    await Gestures.waitAndTap(this.networkAvatarButton);
  }

  async tapBackToSafetyButton() {
    await Gestures.waitAndTap(this.backToSafetyButton);
  }

  async tapReturnHomeButton() {
    await Gestures.waitAndTap(this.returnHomeButton);
  }

  async tapDappInFavorites() {
    if (device.getPlatform() === 'ios') {
      await Gestures.tapWebElement(this.testDappURLInFavouritesTab);
    } else {
      await Gestures.tapWebElement(this.homePageFavouritesTab);
      await Gestures.tapWebElement(this.testDappURLInFavouritesTab);
    }
  }

  async navigateToURL(url) {
    await Gestures.waitAndTap(this.clearURLButton);
    await device.disableSynchronization(); // because animations makes typing into the browser slow

    await Gestures.typeTextAndHideKeyboard(this.urlInputBoxID, url);
    await device.enableSynchronization(); // re-enabling synchronization
  }

  async waitForBrowserPageToLoad() {
    await TestHelpers.delay(5000);
  }

  async navigateToTestDApp() {
    await this.tapUrlInputBox();
    await this.navigateToURL(TEST_DAPP_LOCAL_URL);
  }
}

export default new Browser();
