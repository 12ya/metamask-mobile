import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ButtonSize,
  ButtonWidthTypes,
} from '@component-library/components/Buttons/Button';
import ButtonBase from '@component-library/components/Buttons/Button/foundation/ButtonBase';
import { IconName } from '@component-library/components/Icons/Icon';
import {
  TextColor,
  TextVariant,
} from '@component-library/components/Texts/Text';
import { useTheme } from '@util/theme';
import { Colors } from '@util/theme/models';
import type { QuickAmount } from '@components/UI/Ramp/types';

const createStyles = (colors: Colors) =>
  StyleSheet.create({
    content: {
      backgroundColor: colors.background.default,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 8,
      padding: 16,
    },
    amount: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.border.default,
      backgroundColor: colors.background.default,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: 16,
      alignItems: 'center',
    },
  });

interface AmountProps {
  amount: QuickAmount;
  onPress: (amount: QuickAmount) => void;

  disabled?: boolean;
}

const Amount = ({ amount, onPress }: AmountProps) => {
  const { value, label } = amount;
  const { colors } = useTheme();
  const styles = createStyles(colors);
  const handlePress = useCallback(() => {
    onPress(amount);
  }, [onPress, amount]);

  return (
    <ButtonBase
      onPress={handlePress}
      size={ButtonSize.Md}
      width={ButtonWidthTypes.Full}
      label={label}
      labelColor={TextColor.Default}
      labelTextVariant={TextVariant.BodyMDMedium}
      {...(value === 1 ? { startIconName: IconName.Sparkle } : {})}
      style={styles.amount}
    />
  );
};

interface QuickAmountsProps {
  amounts: QuickAmount[];
  onAmountPress: (amount: QuickAmount) => void;
}

const QuickAmounts = ({ amounts, onAmountPress }: QuickAmountsProps) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);
  return (
    <View style={styles.content}>
      {amounts.map((amount, index: number) => (
        <Amount amount={amount} onPress={onAmountPress} key={index} />
      ))}
    </View>
  );
};

export default QuickAmounts;
