import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StakeInputView from '../Views/StakeInputView/StakeInputView';
import LearnMoreModal from '../components/LearnMoreModal';
import Routes from '../../../../constants/navigation/Routes';
import UnstakeInputView from '../Views/UnstakeInputView/UnstakeInputView';
const Stack = createNativeStackNavigator();
const ModalStack = createNativeStackNavigator();

const clearStackNavigatorOptions = {
  headerShown: false,
  cardStyle: {
    backgroundColor: 'transparent',
  },
  animationEnabled: false,
  presentation: 'modal',
};

// Regular Stack for Screens
const StakeScreenStack = () => (
  <Stack.Navigator>
    <Stack.Screen name={Routes.STAKING.STAKE} component={StakeInputView} />
    <Stack.Screen name={Routes.STAKING.UNSTAKE} component={UnstakeInputView} />
  </Stack.Navigator>
);

// Modal Stack for Modals
const StakeModalStack = () => (
  <ModalStack.Navigator screenOptions={clearStackNavigatorOptions}>
    <ModalStack.Screen
      name={Routes.STAKING.MODALS.LEARN_MORE}
      component={LearnMoreModal}
      options={{ headerShown: false }}
    />
  </ModalStack.Navigator>
);

export { StakeScreenStack, StakeModalStack };
