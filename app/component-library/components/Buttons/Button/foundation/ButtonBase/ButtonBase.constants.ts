/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
// External dependencies.
import { ButtonBaseProps } from './ButtonBase.types';
import { IconName, IconSize } from '@component-library/components/Icons/Icon';
import {
  ButtonSize,
  ButtonWidthTypes,
} from '@component-library/components/Buttons/Button/Button.types';
import {
  TextVariant,
  TextColor,
} from '@component-library/components/Texts/Text';

// Defaults
export const DEFAULT_BUTTONBASE_LABEL_COLOR = TextColor.Default;
export const DEFAULT_BUTTONBASE_SIZE = ButtonSize.Md;
export const DEFAULT_BUTTONBASE_WIDTH = ButtonWidthTypes.Auto;
export const DEFAULT_BUTTONBASE_ICON_SIZE = IconSize.Sm;
export const DEFAULT_BUTTONBASE_LABEL_TEXTVARIANT = TextVariant.BodyMD;

// Samples
export const SAMPLE_BUTTONBASE_PROPS: ButtonBaseProps = {
  label: 'Sample label',
  startIconName: IconName.Add,
  endIconName: IconName.AddSquare,
  size: ButtonSize.Md,
  onPress: () => {
    console.log('Button pressed');
  },
  isDanger: false,
  isDisabled: false,
  width: ButtonWidthTypes.Auto,
};
