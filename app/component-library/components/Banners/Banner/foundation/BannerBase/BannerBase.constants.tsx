/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
// Third library dependencies.
import React from 'react';

// External dependencies.
import { TextVariant } from '@component-library/components/Texts/Text';
import { ButtonVariants, ButtonSize } from '@component-library/components/Buttons/Button';
import { ButtonProps } from '@Buttons/Button/Button.types';
import { ButtonIconSizes } from '@component-library/components/Buttons/ButtonIcon'
import Icon, { IconName, IconColor } from '@component-library/components/Icons/Icon';
import { SAMPLE_ICON_PROPS } from '@Icons/Icon/Icon.constants';

// Internal dependencies.
import { BannerBaseProps } from './BannerBase.types';

// Test IDs
export const TESTID_BANNER_CLOSE_BUTTON_ICON = 'banner-close-button-icon';

// Defaults
export const DEFAULT_BANNERBASE_TITLE_TEXTVARIANT = TextVariant.BodyLGMedium;
export const DEFAULT_BANNERBASE_DESCRIPTION_TEXTVARIANT = TextVariant.BodyMD;
export const DEFAULT_BANNERBASE_ACTIONBUTTON_VARIANT = ButtonVariants.Link;
export const DEFAULT_BANNERBASE_ACTIONBUTTON_SIZE = ButtonSize.Auto;
export const DEFAULT_BANNERBASE_CLOSEBUTTON_BUTTONICON_ICONCOLOR =
  IconColor.Default;
export const DEFAULT_BANNERBASE_CLOSEBUTTON_BUTTONICON_SIZE =
  ButtonIconSizes.Sm;
export const DEFAULT_BANNERBASE_CLOSEBUTTON_BUTTONICON_ICONNAME =
  IconName.Close;

// Samples
const SAMPLE_BANNERBASE_STARTACCESSORY = <Icon {...SAMPLE_ICON_PROPS} />;
const SAMPLE_BANNERBASE_TITLE = 'Sample Banner Title';
const SAMPLE_BANNERBASE_DESCRIPTION = 'Sample Banner Description';
const SAMPLE_BANNERBASE_ACTIONBUTTON_PROPS: ButtonProps = {
  variant: ButtonVariants.Secondary,
  label: 'Action Label',
  onPress: () => {
    console.log('clicked');
  },
};
export const SAMPLE_BANNERBASE_PROPS: BannerBaseProps = {
  startAccessory: SAMPLE_BANNERBASE_STARTACCESSORY,
  title: SAMPLE_BANNERBASE_TITLE,
  description: SAMPLE_BANNERBASE_DESCRIPTION,
  actionButtonProps: SAMPLE_BANNERBASE_ACTIONBUTTON_PROPS,
  onClose: () => {
    console.log('clicked');
  },
};
