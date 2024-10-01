/* eslint-disable react/prop-types */

// Third party dependencies.
import React from 'react';

// External dependencies.
import { useStyles } from '@components/hooks/useStyles';
import HeaderBase from '@component-library/components/HeaderBase';
import ButtonIcon from '@component-library/components/Buttons/ButtonIcon'
import { IconName, IconColor } from '@component-library/components/Icons/Icon';

// Internal dependencies.
import styleSheet from './BottomSheetHeader.styles';
import { BottomSheetHeaderProps } from './BottomSheetHeader.types';

const BottomSheetHeader: React.FC<BottomSheetHeaderProps> = ({
  style,
  children,
  onBack,
  onClose,
  ...props
}) => {
  const { styles } = useStyles(styleSheet, { style });
  const startAccessory = onBack && (
    <ButtonIcon
      iconName={IconName.ArrowLeft}
      iconColor={IconColor.Default}
      onPress={onBack}
    />
  );

  const endAccessory = onClose && (
    <ButtonIcon
      iconName={IconName.Close}
      iconColor={IconColor.Default}
      onPress={onClose}
    />
  );

  return (
    <HeaderBase
      style={styles.base}
      startAccessory={startAccessory}
      endAccessory={endAccessory}
      {...props}
    >
      {children}
    </HeaderBase>
  );
};

export default BottomSheetHeader;
