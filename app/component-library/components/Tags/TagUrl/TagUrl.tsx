/* eslint-disable react/prop-types */

// Third party dependencies.
import React from 'react';
import { View } from 'react-native';

// External dependencies.
import Avatar, { AvatarSize, AvatarVariant } from '@component-library/components/Avatars/Avatar';
import Button, { ButtonVariants } from '@component-library/components/Buttons/Button';
import Text, { TextVariant } from '@component-library/components/Texts/Text';
import { useStyles } from '@components/hooks/useStyles';

// Internal dependencies.
import styleSheet from './TagUrl.styles';
import { TagUrlProps } from './TagUrl.types';

const TagUrl = ({ imageSource, label, cta, style, ...props }: TagUrlProps) => {
  const { styles } = useStyles(styleSheet, { style });
  return (
    <View style={styles.base} {...props}>
      <Avatar
        variant={AvatarVariant.Favicon}
        imageSource={imageSource}
        size={AvatarSize.Md}
        style={styles.favicon}
      />
      <Text style={styles.label} variant={TextVariant.BodyMD}>
        {label}
      </Text>
      {cta && (
        <Button
          variant={ButtonVariants.Link}
          style={styles.cta}
          onPress={cta.onPress}
          label={cta.label}
        />
      )}
    </View>
  );
};

export default TagUrl;
