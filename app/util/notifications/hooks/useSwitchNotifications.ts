import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Logger from '../../../util/Logger';
import Creators from '../../../store/ducks/notifications';
import {
  SwitchSnapNotificationsChangeReturn,
  SwitchFeatureAnnouncementsChangeReturn,
  SwitchAccountNotificationsReturn,
  UseSwitchAccountNotificationsData,
  SwitchAccountNotificationsChangeReturn,
} from './types';

export function useSwitchSnapNotificationsChange(): SwitchSnapNotificationsChangeReturn {
  const dispatch = useDispatch();

  const [error, setError] = useState<null | string>(null);

  const onChange = useCallback(
    async (state: boolean) => {
      setError(null);

      try {
        await dispatch(Creators.setSnapNotificationsEnabledRequest(state));
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : (JSON.stringify(e ?? '') as any);
        setError(errorMessage);
        Logger.error(errorMessage);
        throw e;
      }
    },
    [dispatch],
  );

  return {
    onChange,
    error,
  };
}

export function useSwitchFeatureAnnouncementsChange(): SwitchFeatureAnnouncementsChangeReturn {
  const dispatch = useDispatch();

  const [error, setError] = useState<null | string>(null);

  const onChange = useCallback(
    async (state: boolean) => {
      setError(null);

      try {
        await dispatch(Creators.setFeatureAnnouncementsEnabledRequest(state));
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : (JSON.stringify(e ?? '') as any);
        setError(errorMessage);
        throw e;
      }
    },
    [dispatch],
  );

  return {
    onChange,
    error,
  };
}

export function useSwitchAccountNotifications(
  accounts: string[],
): SwitchAccountNotificationsReturn {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const switchAccountNotifications = useCallback(async (): Promise<
    UseSwitchAccountNotificationsData | undefined
  > => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await dispatch(
        Creators.checkAccountsPresenceRequest(accounts),
      );
      return data as unknown as UseSwitchAccountNotificationsData;
    } catch (e) {
      const errorMessage =
        e instanceof Error ? e.message : (JSON.stringify(e ?? '') as any);
      setError(errorMessage);
      Logger.error(errorMessage);
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, [accounts, dispatch]);

  return { switchAccountNotifications, isLoading, error };
}

export function useSwitchAccountNotificationsChange(): SwitchAccountNotificationsChangeReturn {
  const dispatch = useDispatch();

  const [error, setError] = useState<string | null>(null);

  const onChange = useCallback(
    async (accounts: string[], state: boolean) => {
      setError(null);

      try {
        if (state) {
          await dispatch(
            Creators.updateOnChainTriggersByAccountRequest(accounts),
          );
        } else {
          await dispatch(
            Creators.deleteOnChainTriggersByAccountRequest(accounts),
          );
        }
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : (JSON.stringify(e ?? '') as any);
        Logger.error(errorMessage);
        setError(errorMessage);
        throw e;
      }
      dispatch(Creators.hideLoadingIndication());
    },
    [dispatch],
  );

  return {
    onChange,
    error,
  };
}
