import TestHelpers from '../helpers';
import TabBarComponent from '../pages/TabBarComponent';
import WalletActionsModal from '../pages/modals/WalletActionsModal';

export default class SwapView {
  static swapOnboarded = false

  static async tapStartSwapping() {
    await TestHelpers.waitAndTapText('Start swapping')
  }

  static async findKeypadButton(digit) {
    return await TestHelpers.waitAndTapText(digit);
  }
  static async enterSwapAmount(amount) {
    for (let idx = 0; idx < amount.length; idx++) {
      await await TestHelpers.waitAndTapText(amount[idx])
    }
  }

  static async tapOnSelectSourceToken() {
    return await TestHelpers.waitAndTap('select-source-token')
  }

  static async tapOnSelectDestToken() {
    return await TestHelpers.waitAndTap('select-dest-token')
  }

  static async selectToken(symbol, name) {
    await TestHelpers.waitAndTap('swaps-search-token')
    await TestHelpers.typeText('swaps-search-token', symbol)
    await TestHelpers.delay(1000)
    return TestHelpers.waitAndTapText(name)
  }

  static async tapOnGetQuotes() {
    await TestHelpers.checkIfElementByTextIsVisible("Get quotes")
    return await TestHelpers.waitAndTapText("Get quotes")
  }

  static async swipeToSwap() {
    if (device.getPlatform() === 'ios') {
      await TestHelpers.swipe('swipe-to-swap-button', 'right', 'slow', .72);
      await TestHelpers.delay(500)
      await TestHelpers.swipe('swipe-to-swap-button', 'right', 'slow', .72);
    } else {
      await TestHelpers.swipe('swipe-to-swap-button', 'right', 'slow', .80);
    }
  }


  static async  swapToken(quantity, sourceTokenSymbol, sourceTokenName, destTokenSymbol, destTokenName) {
    await TabBarComponent.tapActions();
    await WalletActionsModal.tapSwapButton();

    if (!this.swapOnboarded) {
      await this.tapStartSwapping();
      this.swapOnboarded = true
    }

    await this.tapOnSelectSourceToken()
    await this.selectToken(sourceTokenSymbol, sourceTokenName)
    await this.enterSwapAmount(quantity)
    await this.tapOnSelectDestToken()
    await this.selectToken(destTokenSymbol, destTokenName)
    await device.disableSynchronization()
    await this.tapOnGetQuotes()
    await TestHelpers.checkIfElementByTextIsVisible("Fetching quotes")
    await TestHelpers.checkIfVisible('swap-quote-summary')
    await TestHelpers.checkIfVisible('swap-gas-fee')
    await TestHelpers.delay(2000)
    await this.swipeToSwap()

    //Check that the swap completed
    await TestHelpers.checkIfElementByTextIsVisible(`Swap!`)
    await TestHelpers.checkIfElementByTextIsVisible(`Swap complete (${sourceTokenSymbol} to ${destTokenSymbol})`)
    await device.enableSynchronization()
  }


}

