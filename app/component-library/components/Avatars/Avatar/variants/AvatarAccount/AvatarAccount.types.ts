// External dependencies.
import { AvatarBaseProps } from '@component-library/components/Avatars/Avatar/foundation/AvatarBase';

/**
 * AvatarAccount variants.
 */
export enum AvatarAccountType {
  JazzIcon = 'JazzIcon',
  Blockies = 'Blockies',
}

/**
 * AvatarAccount component props.
 */
export interface AvatarAccountProps extends AvatarBaseProps {
  /**
   * An Ethereum wallet address.
   */
  accountAddress: string;
  /**
   * Optional enum to select the avatar type between `JazzIcon` and `Blockies`.
   * @default JazzIcon
   */
  type?: AvatarAccountType;
}
