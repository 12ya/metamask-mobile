import { Given, When, Then } from '@wdio/cucumber-framework'
import OnboardingPages from '../pageobjects/onboarding.pages.js'

const OnboardingPage = new OnboardingPages();

Given(/^I have installed MetaMask mobile app on my device/, async () => {
    /** This is automatically done by the automation framework **/
});

When(/^I tap to open MetaMask mobile app/, async () => {
    // await driver.launchApp();
    // await driver.switchContext('NATIVE_APP');
    // await OnboardingPages.verifyWelcomeScreen();
    // await driver.pause(15000);
});

Then(/^MetaMask animated loading logo is displayed/, async () => {
    // check for animated loading logo
    await OnboardingPage.verifyWelcomeScreen();

});

Then(/^(.*) screen is displayed after logo/, async (title) => {
    // check for Welcome to MetaMask screen
    await OnboardingPage.verifyWelcomeScreen();
});
Then(/^(.*) user can tap get started/, async () => {
    // check for Welcome to MetaMask screen
    await OnboardingPage.tapGetStartedButton();
});
