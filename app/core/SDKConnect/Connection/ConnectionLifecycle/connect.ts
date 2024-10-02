import DevLogger from '@core/SDKConnect/utils/DevLogger';
import { Connection } from '@core/SDKConnect/Connection';

async function connect({
  withKeyExchange,
  instance,
  authorized,
}: {
  withKeyExchange: boolean;
  rejected?: boolean;
  instance: Connection;
  authorized: boolean;
}) {
  DevLogger.log(
    `Connection::connect() id=${instance.channelId} withKeyExchange=${withKeyExchange} authorized=${authorized}`,
  );
  await instance.remote.connectToChannel({
    channelId: instance.channelId,
    authorized,
    withKeyExchange,
  });
  instance.receivedDisconnect = false;
}

export default connect;
