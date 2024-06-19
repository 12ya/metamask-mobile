import type { InternalAccount } from '@metamask/keyring-api';
import { KeyringTypes } from '@metamask/keyring-controller';
import type { Notification } from '../../../util/notifications/types/notification';

export interface UseCreateSessionReturn {
  createSession: () => void;
  error?: string;
}
export interface EnableMetametricsReturn {
  enableMetametrics: () => void;
  loading: boolean;
  error?: string;
}
export interface DisableMetametricsReturn {
  disableMetametrics: () => void;
  loading: boolean;
  error?: string;
}
export interface ListNotificationsReturn {
  listNotifications: () => void;
  notificationsData?: Notification[];
  isLoading: boolean;
  error?: string;
}
export interface CreateNotificationsReturn {
  createNotifications: (accounts: string[]) => void;
  loading: boolean;
  error?: string;
}
export interface EnableNotificationsReturn {
  enableNotifications: () => void;
  loading: boolean;
  error?: string;
}
export type AccountType = InternalAccount & {
  balance: string;
  keyring: KeyringTypes;
  label: string;
};

export interface DisableNotificationsReturn {
  disableNotifications: () => void;
  loading: boolean;
  error?: string;
}

export interface MarkNotificationAsReadReturn {
  markNotificationAsRead: (notifications: Notification[]) => void;
  error?: string;
}

export interface EnableProfileSyncingReturn {
  enableProfileSyncing: () => void;
  error?: string;
}

export interface DisableProfileSyncingReturn {
  disableProfileSyncing: () => void;
  error?: string;
}

export interface SetIsProfileSyncingEnabledReturn {
  setIsProfileSyncingEnabled: () => void;
  error?: string;
}

export interface SwitchSnapNotificationsChangeReturn {
  onChange: (state: boolean) => void;
  error?: string;
}
export interface SwitchFeatureAnnouncementsChangeReturn {
  onChange: (state: boolean) => void;
  error?: string;
}

export interface SwitchPushNotificationsReturn {
  onChange: (UUIDS: string[], state: boolean) => void;
  error?: string;
}

export interface UseSwitchAccountNotificationsData {
  [address: string]: boolean;
}

export interface SwitchAccountNotificationsReturn {
  switchAccountNotifications: () => void;
  isLoading: boolean;
  error?: string;
}

export interface SwitchAccountNotificationsChangeReturn {
  onChange: (addresses: string[], state: boolean) => void;
  error?: string;
}