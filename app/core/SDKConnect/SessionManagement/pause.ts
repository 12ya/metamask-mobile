import { disconnectAll } from '@actions/sdk';
import SDKConnect from '@core/SDKConnect/SDKConnect';
import DevLogger from '@core/SDKConnect/utils/DevLogger';
import { store } from '@store/index';

function pause(instance: SDKConnect) {
  if (instance.state.paused) return;

  for (const id in instance.state.connected) {
    if (!instance.state.connected[id].remote.isReady()) {
      DevLogger.log(`SDKConnect::pause - SKIP - non active connection ${id}`);
      continue;
    }
    DevLogger.log(`SDKConnect::pause - pausing ${id}`);
    instance.state.connected[id].pause();
    // check for paused status?
    DevLogger.log(
      `SDKConnect::pause - done - paused=${instance.state.connected[
        id
      ].remote.isPaused()}`,
    );
  }
  instance.state.paused = true;
  instance.state.connecting = {};
  // Set disconnected status for all connections
  store.dispatch(disconnectAll());
}

export default pause;
