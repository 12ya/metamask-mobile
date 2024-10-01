/* eslint-disable react/prop-types */

// Third party dependencies.
import React from 'react';
import { View } from 'react-native';

// External dependencies.
import Text, { TextVariant } from '@component-library/components/Texts/Text';
import { useStyles } from '@components/hooks/useStyles';

// Internal dependencies.
import styleSheet from './Tag.styles';
import { TagProps } from './Tag.types';

const Tag = ({ label, style, ...props }: TagProps) => {
  const { styles } = useStyles(styleSheet, { style });

  return (
    <View style={styles.base} {...props}>
      <Text variant={TextVariant.BodyMD}>{label}</Text>
    </View>
  );
};

export default Tag;
