import React from 'react';
import { View } from 'react-native';

import { baseStyles } from '../../../../../styles/common';
import ErrorBoundary from '../../../ErrorBoundary';
import generateTestId from '../../../../../../wdio/utils/generateTestId';

/**
 * Main view for the wallet
 */
const Default = ({
  navigation,
  selectedAddress,
  renderContent,
  renderLoader,
  renderOnboardingWizard,
}: {
  navigation: any;
  selectedAddress: string;
  renderContent: () => JSX.Element;
  renderLoader: () => JSX.Element;
  renderOnboardingWizard: () => JSX.Element;
}) => (
  <ErrorBoundary navigation={navigation} view="Wallet">
    <View style={baseStyles.flexGrow} {...generateTestId('wallet-screen')}>
      {renderContent()}
      {selectedAddress ? renderContent() : renderLoader()}

      {renderOnboardingWizard()}
    </View>
  </ErrorBoundary>
);

export default Default;
