// Third party dependencies.
import { ImageSourcePropType } from 'react-native';

// External Dependencies.
import { AvatarAccountType } from '@component-library/components/Avatars/Avatar/variants/AvatarAccount';
import { ButtonProps } from '@component-library/components/Buttons/Button/Button.types';
import { IconName } from '@component-library/components/Icons/Icon';

/**
 * Toast variants.
 */
export enum ToastVariants {
  Plain = 'Plain',
  Account = 'Account',
  Network = 'Network',
  Icon = 'Icon',
}

/**
 * Options for the main text in the toast.
 */
export type ToastLabelOptions = {
  label: string;
  isBold?: boolean;
}[];

/**
 * Options for displaying a Link in the toast.
 */
export interface ToastLinkButtonOptions {
  label: string;
  onPress: () => void;
}

/**
 * Common toast option shared between all other options.
 */
interface BaseToastVariants {
  hasNoTimeout: boolean;
  labelOptions: ToastLabelOptions;
  linkButtonOptions?: ToastLinkButtonOptions;
  closeButtonOptions?: ButtonProps;
}

/**
 * Plain toast option.
 */
interface PlainToastOption extends BaseToastVariants {
  variant: ToastVariants.Plain;
}

/**
 * Account toast option.
 */
interface AccountToastOption extends BaseToastVariants {
  variant: ToastVariants.Account;
  accountAddress: string;
  accountAvatarType: AvatarAccountType;
}

/**
 * Network toast option.
 */
interface NetworkToastOption extends BaseToastVariants {
  variant: ToastVariants.Network;
  networkName?: string;
  networkImageSource: ImageSourcePropType;
}

interface IconToastOption extends BaseToastVariants {
  variant: ToastVariants.Icon;
  iconName: IconName;
  iconColor?: string;
  backgroundColor?: string;
}

/**
 * Different toast options combined in a union type.
 */
export type ToastOptions =
  | PlainToastOption
  | AccountToastOption
  | NetworkToastOption
  | IconToastOption;

/**
 * Toast component reference.
 */
export interface ToastRef {
  showToast: (toastOptions: ToastOptions) => void;
  closeToast: () => void;
}

/**
 * Toast context parameters.
 */
export interface ToastContextParams {
  toastRef: React.RefObject<ToastRef> | undefined;
}
