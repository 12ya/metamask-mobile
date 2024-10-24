import { useRef, useCallback } from 'react';
import {
  useMetrics,
  MetaMetricsEvents,
} from '../../components/hooks/useMetrics';

// TODO: Replace "any" with type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useConnectionHandler = (navigation: any) => {
  const connectedRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { trackEvent } = useMetrics();

  const connectionChangeHandler = useCallback(
    (state: { isConnected: boolean } | null) => {
      if (!state) return;
      const { isConnected } = state;

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (connectedRef.current !== isConnected) {
        if (isConnected === false) {
          trackEvent(MetaMetricsEvents.CONNECTION_DROPPED);
          timeoutRef.current = setTimeout(() => {
            navigation.navigate('OfflineModeView');
          }, 3000);
        } else {
          trackEvent(MetaMetricsEvents.CONNECTION_RESTORED);
        }
        connectedRef.current = isConnected;
      }
    },
    [navigation, trackEvent],
  );

  return { connectionChangeHandler };
};
