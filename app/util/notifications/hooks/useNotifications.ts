import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import type { InternalAccount } from '@metamask/keyring-api';
import Logger from '../../../util/Logger';
import type {
  Notification,
  MarkAsReadNotificationsParam,
} from '../../../app/scripts/controllers/metamask-notifications/types/notification/notification';
import {
  createOnChainTriggers,
  fetchAndUpdateMetamaskNotifications,
  markMetamaskNotificationsAsRead,
  setMetamaskNotificationsFeatureSeen,
  enableMetamaskNotifications,
  disableMetamaskNotifications,
} from '../../../actions/notification';

// Define KeyringType interface
interface KeyringType {
  type: string;
}

// Define AccountType interface
export type AccountType = InternalAccount & {
  balance: string;
  keyring: KeyringType;
  label: string;
};

/**
 * Custom hook to fetch and update the list of notifications.
 * Manages loading and error states internally.
 *
 * @returns An object containing the `listNotifications` function, loading state, and error state.
 */
export function useListNotifications(): {
  listNotifications: () => Promise<Notification[] | undefined>;
  notificationsData?: Notification[];
  isLoading: boolean;
  error?: unknown;
} {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(null);
  const [notificationsData, setNotificationsData] = useState<
    Notification[] | undefined
  >(undefined);

  const listNotifications = useCallback(async (): Promise<
    Notification[] | undefined
  > => {
    setLoading(true);
    setError(null);

    try {
      const data = await dispatch(fetchAndUpdateMetamaskNotifications());
      setNotificationsData(data as unknown as Notification[]);
      return data as unknown as Notification[];
    } catch (e: any) {
      Logger.error(e);
      setError(e instanceof Error ? e.message : 'An unexpected error occurred');
      throw e;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    listNotifications,
    notificationsData,
    isLoading: loading,
    error,
  };
}

/**
 * Custom hook to enable notifications by creating on-chain triggers.
 * It manages loading and error states internally.
 *
 * @returns An object containing the `enableNotifications` function, loading state, and error state.
 */
export function useCreateNotifications(): {
  createNotifications: () => Promise<void>;
  loading: boolean;
  error: string | null;
} {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(createOnChainTriggers());
      dispatch(setMetamaskNotificationsFeatureSeen());
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred');
      Logger.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    createNotifications,
    loading,
    error,
  };
}

/**
 * Custom hook to enable MetaMask notifications.
 * This hook encapsulates the logic for enabling notifications, handling loading and error states.
 * It uses Redux to dispatch actions related to notifications.
 *
 * @returns An object containing:
 * - `enableNotifications`: A function that triggers the enabling of notifications.
 * - `loading`: A boolean indicating if the enabling process is ongoing.
 * - `error`: A string or null value representing any error that occurred during the process.
 */
export function useEnableNotifications(): {
  enableNotifications: () => Promise<void>;
  loading: boolean;
  error: string | null;
} {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const enableNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(enableMetamaskNotifications());
      dispatch(setMetamaskNotificationsFeatureSeen());
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred');
      Logger.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    enableNotifications,
    loading,
    error,
  };
}

/**
 * Custom hook to disable notifications by deleting on-chain triggers associated with accounts.
 * It also disables snap and feature announcements. Manages loading and error states internally.
 *
 * @returns An object containing the `disableNotifications` function, loading state, and error state.
 */
export function useDisableNotifications(): {
  disableNotifications: () => Promise<void>;
  loading: boolean;
  error: string | null;
} {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const disableNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await dispatch(disableMetamaskNotifications());
    } catch (e: any) {
      setError(e instanceof Error ? e.message : 'An unexpected error occurred');
      Logger.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return {
    disableNotifications,
    loading,
    error,
  };
}

/**
 * Custom hook to mark specific notifications as read.
 * It accepts a parameter of notifications to be marked as read and manages loading and error states internally.
 *
 * @param notifications - The notifications to mark as read.
 * @returns An object containing the `markNotificationAsRead` function, loading state, and error state.
 */
export function useMarkNotificationAsRead(
  notifications: MarkAsReadNotificationsParam,
): {
  markNotificationAsRead: () => Promise<void>;
} {
  const dispatch = useDispatch();

  const markNotificationAsRead = useCallback(async () => {
    try {
      dispatch(markMetamaskNotificationsAsRead(notifications));
    } catch (e: any) {
      Logger.error(e);
      throw e;
    }
  }, [dispatch, notifications]);

  return {
    markNotificationAsRead,
  };
}
