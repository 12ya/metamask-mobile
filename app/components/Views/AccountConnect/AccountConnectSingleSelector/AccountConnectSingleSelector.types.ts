// External dependencies.
import { UseAccounts } from '@components/hooks/useAccounts';
import { USER_INTENT } from '@constants/permissions';
import { AccountConnectScreens } from '@components/Views/AccountConnect.types';

/**
 * AccountConnectSingleSelector props.
 */
export interface AccountConnectSingleSelectorProps extends UseAccounts {
  selectedAddresses: string[];
  isLoading?: boolean;
  onSetScreen: (screen: AccountConnectScreens) => void;
  onSetSelectedAddresses: (addresses: string[]) => void;
  onUserAction: React.Dispatch<React.SetStateAction<USER_INTENT>>;
}
