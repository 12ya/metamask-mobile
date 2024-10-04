import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StakeInputView from '../Views/InputView/StakeInputView';
import LearnMoreModal from '../components/LearnMoreModal';
import Routes from '../../../../constants/navigation/Routes';
import StakeConfirmationView from '../Views/StakeConfirmationView/StakeConfirmationView';
import UnstakeConfirmationView from '../Views/UnstakeConfirmationView/UnstakeConfirmationView';
import ClaimConfirmationView from '../Views/ClaimConfirmationView/ClaimConfirmationView';

const Stack = createStackNavigator();
const ModalStack = createStackNavigator();

const clearStackNavigatorOptions = {
  headerShown: false,
  cardStyle: {
    backgroundColor: 'transparent',
  },
  animationEnabled: false,
};

// Regular Stack for Screens
const StakeScreenStack = () => (
  <Stack.Navigator>
    <Stack.Screen name={Routes.STAKING.STAKE} component={StakeInputView} />
    <Stack.Screen
      name={Routes.STAKING.STAKE_CONFIRMATION}
      component={StakeConfirmationView}
    />
    <Stack.Screen
      name={Routes.STAKING.UNSTAKE_CONFIRMATION}
      component={UnstakeConfirmationView}
    />
    <Stack.Screen
      name={Routes.STAKING.CLAIM_CONFIRMATION}
      component={ClaimConfirmationView}
    />
  </Stack.Navigator>
);

// Modal Stack for Modals
const StakeModalStack = () => (
  <ModalStack.Navigator
    mode={'modal'}
    screenOptions={clearStackNavigatorOptions}
  >
    <ModalStack.Screen
      name={Routes.STAKING.MODALS.LEARN_MORE}
      component={LearnMoreModal}
      options={{ headerShown: false }}
    />
  </ModalStack.Navigator>
);

export { StakeScreenStack, StakeModalStack };
