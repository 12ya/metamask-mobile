import { useEffect, useState } from 'react';
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import { Observable, Observer, Subscription } from 'rxjs';

export interface BluetoothDevice {
  id: string;
  name: string;
}

// Works with any Bluetooth Interface that provides a listen method
export interface BluetoothInterface {
  listen(
    observer: Observer<{
      type: string;
      descriptor: { id: string };
    }>,
  ): { unsubscribe: () => void };
  // TODO: Replace "any" with type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string, callback: (event: any) => void): void;
  close(): void;
}

export interface ObservableType {
  type: string,
  descriptor: BluetoothDevice,
  deviceModel: never,
}

const useBluetoothDevices = (
  hasBluetoothPermissions: boolean,
  bluetoothOn: boolean,
) => {
  const [devices, setDevices] = useState<Record<string, BluetoothDevice>>({});
  const [deviceScanError, setDeviceScanError] = useState<boolean>(false);
  const [event, setEvent] = useState<ObservableType>();

  // Initiate scanning and pairing if bluetooth is enabled
  useEffect(() => {
    let subscription: Subscription;

    if (hasBluetoothPermissions && bluetoothOn) {
      subscription = new Observable(TransportBLE.listen).subscribe({
        next: (e: ObservableType) => {
          setEvent(e);
        },
        error: (_error) => {
          setDeviceScanError(true);
        },
        complete: () => {
          console.warn('complete');
        }
      });
    }

    return () => {
      subscription?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasBluetoothPermissions, bluetoothOn]);

  useEffect(() =>{
    if (event) {
      if (event?.descriptor) {
        const btDevice = event.descriptor;
        const deviceFound = devices[btDevice.id];

        if (event.type === 'add' && !deviceFound) {
          setDevices((prevValues) => ({
              ...prevValues,
              [btDevice.id]: btDevice,
            }));
          setDeviceScanError(false);
        }
      }
    }
  }, [event, devices]);

  return {
    deviceScanError,
    devices: Object.values(devices),
  };
};

export default useBluetoothDevices;
