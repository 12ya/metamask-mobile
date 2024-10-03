import React from 'react';
import { View } from 'react-native';

import BottomModal from '@components/UI/BottomModal';
import { useTheme } from '@util/theme';
import Footer from '@components/Views/confirmations/components/Confirm/Footer';
import Title from '@components/Views/confirmations/components/Confirm/Title';
import useConfirmationRedesignEnabled from '@components/Views/confirmations/hooks/useConfirmationRedesignEnabled';
import createStyles from './style';

const Confirm = () => {
  const { colors } = useTheme();
  const { isRedesignedEnabled } = useConfirmationRedesignEnabled();

  if (!isRedesignedEnabled) {
    return null;
  }

  const styles = createStyles(colors);

  return (
    <BottomModal>
      <View style={styles.container}>
        <Title />
        <Footer />
      </View>
    </BottomModal>
  );
};

export default Confirm;
