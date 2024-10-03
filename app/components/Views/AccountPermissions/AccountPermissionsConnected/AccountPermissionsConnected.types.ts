// Third party dependencies.
import { ImageSourcePropType } from 'react-native';

// External dependencies.
import { UseAccounts } from '@components/hooks/useAccounts';
import { AccountPermissionsScreens } from '@components/Views/AccountPermissions/AccountPermissions.types';
import { IconName } from '@component-library/components/Icons/Icon';
import { AvatarAccountType } from '@component-library/components/Avatars/Avatar/variants/AvatarAccount';

/**
 * AccountPermissionsConnected props.
 */
export interface AccountPermissionsConnectedProps extends UseAccounts {
  isLoading?: boolean;
  selectedAddresses: string[];
  onSetSelectedAddresses: (addresses: string[]) => void;
  onSetPermissionsScreen: (screen: AccountPermissionsScreens) => void;
  onDismissSheet: () => void;
  hostname: string;
  urlWithProtocol: string;
  favicon: ImageSourcePropType;
  secureIcon: IconName;
  accountAvatarType: AvatarAccountType;
}
