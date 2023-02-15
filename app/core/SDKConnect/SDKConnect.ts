import {
  CommunicationLayerMessage,
  CommunicationLayerPreference,
  ConnectionStatus,
  EventType,
  MessageType,
  OriginatorInfo,
  RemoteCommunication,
} from '@metamask/sdk-communication-layer';
import BackgroundTimer from 'react-native-background-timer';
import AppConstants from '../AppConstants';
import DefaultPreference from 'react-native-default-preference';

import {
  TransactionController,
  WalletDevice,
} from '@metamask/transaction-controller';
import { AppState } from 'react-native';
import Minimizer from 'react-native-minimizer';
import Device from '../../util/device';
import Logger from '../../util/Logger';
import BackgroundBridge from '../BackgroundBridge/BackgroundBridge';
import Engine from '../Engine';
import getRpcMethodMiddleware, {
  ApprovalTypes,
} from '../RPCMethods/RPCMethodMiddleware';

import { KeyringController } from '@metamask/keyring-controller';
import { EventEmitter2 } from 'eventemitter2';
import {
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
  registerGlobals,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCView,
} from 'react-native-webrtc';
import { store } from '../../../app/store';
import { toggleSDKLoadingModal } from '../../../app/actions/modals';
import { ApprovalController } from '@metamask/approval-controller';
import { v1 as random } from 'uuid';
import { PreferencesController } from '@metamask/preferences-controller';

export const MIN_IN_MS = 1000 * 60;
export const HOUR_IN_MS = MIN_IN_MS * 60;
export const DAY_IN_MS = HOUR_IN_MS * 24;
export const DEFAULT_SESSION_TIMEOUT_MS = 7 * DAY_IN_MS;

export interface ConnectionProps {
  id: string;
  otherPublicKey: string;
  origin: string;
  reconnect?: boolean;
  originatorInfo?: OriginatorInfo;
  validUntil: number;
}
export interface ConnectedSessions {
  [id: string]: Connection;
}

export interface SDKSessions {
  [chanelId: string]: ConnectionProps;
}

export interface ApprovedHosts {
  [host: string]: string;
}

export interface approveHostProps {
  host: string;
  hostname: string;
}

export const TIMEOUT_PAUSE_CONNECTIONS = 20000;

export type SDKEventListener = (event: string) => void;

export const MM_SDK_REMOTE_ORIGIN = 'MMSDKREMOTE::';

const CONNECTION_LOADING_EVENT = 'loading';

export const CONNECTION_CONFIG = {
  serverUrl: 'http://192.168.50.114:4000',
  // serverUrl: 'https://6831-1-36-226-145.ap.ngrok.io',
  platform: 'metamask-mobile',
  context: 'mm-mobile',
  sdkRemoteOrigin: 'MMSDKREMOTE::',
  unknownParam: 'UNKNOWN',
};

export const METHODS_TO_REDIRECT: { [method: string]: boolean } = {
  eth_requestAccounts: true,
  eth_sendTransaction: true,
  eth_signTransaction: true,
  eth_sign: true,
  personal_sign: true,
  eth_signTypedData: true,
  eth_signTypedData_v3: true,
  eth_signTypedData_v4: true,
  wallet_watchAsset: true,
  wallet_addEthereumChain: true,
  wallet_switchEthereumChain: true,
};

const webrtc = {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
};

export enum Sources {
  'web-desktop' = 'web-desktop',
  'web-mobile' = 'web-mobile',
  'nodejs' = 'nodejs',
  'unity' = 'unity',
}

const parseSource = (source: string) => {
  if ((Object as any).values(Sources).includes(source)) return source;
  return 'undefined';
};

const waitForKeychainUnlocked = async () => {
  let i = 0;
  const keyringController = (
    Engine.context as { KeyringController: KeyringController }
  ).KeyringController;
  while (!keyringController.isUnlocked()) {
    await new Promise<void>((res) => setTimeout(() => res(), 1000));
    if (i++ > 60) break;
  }
};

export class Connection extends EventEmitter2 {
  channelId;
  remote: RemoteCommunication;
  requestsToRedirect: { [request: string]: boolean } = {};
  origin: string;
  host: string;
  originatorInfo?: OriginatorInfo;
  isReady = false;
  backgroundBridge?: BackgroundBridge;
  reconnect: boolean;

  approveHost: ({ host, hostname }: approveHostProps) => void;
  getApprovedHosts: (context: string) => ApprovedHosts;
  disapprove: (channelId: string) => void;
  revalidate: ({ channelId }: { channelId: string }) => void;
  isApproved: ({
    channelId,
  }: {
    channelId: string;
    context?: string;
  }) => boolean;
  onTerminate: ({ channelId }: { channelId: string }) => void;

  constructor({
    id,
    otherPublicKey,
    origin,
    reconnect,
    approveHost,
    getApprovedHosts,
    disapprove,
    revalidate,
    isApproved,
    updateOriginatorInfos,
    onTerminate,
  }: ConnectionProps & {
    approveHost: ({ host, hostname }: approveHostProps) => void;
    getApprovedHosts: (context: string) => ApprovedHosts;
    disapprove: (channelId: string) => void;
    revalidate: ({ channelId }: { channelId: string }) => void;
    isApproved: ({ channelId }: { channelId: string }) => boolean;
    onTerminate: ({ channelId }: { channelId: string }) => void;
    updateOriginatorInfos: (params: {
      channelId: string;
      originatorInfo: OriginatorInfo;
    }) => void;
  }) {
    super();
    this.origin = origin;
    this.channelId = id;
    this.reconnect = reconnect || false;
    this.host = `${MM_SDK_REMOTE_ORIGIN}${this.channelId}`;
    this.approveHost = approveHost;
    this.getApprovedHosts = getApprovedHosts;
    this.disapprove = disapprove;
    this.revalidate = revalidate;
    this.isApproved = isApproved;
    this.onTerminate = onTerminate;

    this.remote = new RemoteCommunication({
      platform: CONNECTION_CONFIG.platform,
      communicationServerUrl: CONNECTION_CONFIG.serverUrl,
      communicationLayerPreference: CommunicationLayerPreference.SOCKET,
      otherPublicKey,
      webRTCLib: webrtc,
      reconnect,
      context: CONNECTION_CONFIG.context,
      analytics: true,
      logging: {
        eciesLayer: true,
        keyExchangeLayer: true,
        remoteLayer: true,
        serviceLayer: true,
      },
      storage: {
        debug: false,
      },
    });

    this.requestsToRedirect = {};

    this.sendMessage = this.sendMessage.bind(this);

    this.remote.on(EventType.CLIENTS_DISCONNECTED, () => {
      this.emit(CONNECTION_LOADING_EVENT, false);
      Logger.log(`Connection::on::clients_disconnected `);
      // Disapprove a given host everytime there is a disconnection to prevent hijacking.
      // disapprove(this.channelId);
    });

    this.remote.on(
      EventType.CLIENTS_READY,
      async (clientsReadyMsg: { originatorInfo: OriginatorInfo }) => {
        Logger.log(`Connection::on::clients_Ready QWERTYYYY `, clientsReadyMsg);

        this.emit(CONNECTION_LOADING_EVENT, { loading: true });
        if (this.isReady) {
          Logger.log(
            `Connection::on::clients_Ready received 'clients_ready' when isReady=true --- disable channel approval`,
          );

          disapprove(this.channelId);
          return;
        }

        // clients_ready is sent multple time.
        // The first time it sent without originatorInfo
        const originatorInfo = clientsReadyMsg?.originatorInfo;

        // Make sure we only initialize the bridge when originatorInfo is received.
        if (!originatorInfo) {
          Logger.log(
            `Connection::on::clients_Ready invalid originatorInfo -- skip bagroundbridge`,
          );
          return;
        }

        this.originatorInfo = originatorInfo;
        updateOriginatorInfos({ channelId: this.channelId, originatorInfo });
        this.setupBridge(originatorInfo);
        this.isReady = true;
      },
    );

    this.remote.on(
      EventType.MESSAGE,
      async (message: CommunicationLayerMessage) => {
        Logger.log(
          `Connection::on 'message' --> this.ready=${this.isReady} method=${message.method}`,
        );
        this.emit(CONNECTION_LOADING_EVENT, false);
        if (!this.isReady) {
          Logger.log(`Connection::on 'message' connection not ready`);
          return;
        }

        // ignore anything other than RPC methods.
        if (!message.method || !message.id) {
          Logger.log(`received invalid rpc message`, message);
          return;
        }

        // handle termination message
        if (message.type === MessageType.TERMINATE) {
          // Delete connection from storage
          this.onTerminate({ channelId: this.channelId });
          return;
        }

        await waitForKeychainUnlocked();

        if (METHODS_TO_REDIRECT[message?.method]) {
          this.requestsToRedirect[message?.id] = true;
        }

        // Check if channel is permitted
        try {
          if (METHODS_TO_REDIRECT[message?.method]) {
            await this.checkPermissions();
          } else {
            Logger.log(`Allowed method`, message);
          }
        } catch (error) {
          // Approval failed - redirect to app with error.
          Logger.log(`Permissions failed -- sending error and might redirect.`);
          this.sendMessage({
            data: {
              error,
              id: message.id,
              jsonrpc: '2.0',
            },
            name: 'metamask-provider',
          });
          return;
        }

        Logger.log(`permissions validated - send to json rpc`);

        Logger.log(
          `Connection::on message rpcId=${message?.id} method: ${message?.method}`,
        );
        // We have to implement this method here since the eth_sendTransaction in Engine is not working because we can't send correct origin
        if (message.method === 'eth_sendTransaction') {
          if (
            !(
              message.params &&
              Array.isArray(message?.params) &&
              message.params.length > 0
            )
          ) {
            Logger.log(`invalid message format!`);
            throw new Error('Invalid message format');
          }

          const transactionController = (
            Engine.context as { TransactionController: TransactionController }
          ).TransactionController;
          try {
            const hash = await (
              await transactionController.addTransaction(
                message.params[0],
                this.originatorInfo?.url
                  ? MM_SDK_REMOTE_ORIGIN + this.originatorInfo?.url
                  : undefined,
                WalletDevice.MM_MOBILE,
              )
            ).result;
            this.sendMessage({
              data: {
                id: message.id,
                jsonrpc: '2.0',
                result: hash,
              },
              name: 'metamask-provider',
            });
          } catch (error) {
            this.sendMessage({
              data: {
                error,
                id: message.id,
                jsonrpc: '2.0',
              },
              name: 'metamask-provider',
            });
          }
          return;
        }

        Logger.log(`Connection::on message recalling backgroundbrigde`);
        this.backgroundBridge?.onMessage({
          name: 'metamask-provider',
          data: message,
          origin: 'sdk',
        });
      },
    );
  }

  public connect({ withKeyExchange }: { withKeyExchange: boolean }) {
    Logger.log(`SDKConnect::Connection::connect() channel=${this.channelId}`);
    this.remote.connectToChannel(this.channelId, withKeyExchange);
    this.emit(CONNECTION_LOADING_EVENT, { loading: true });
    if (withKeyExchange) {
      this.remote.on(EventType.CLIENTS_WAITING, () => {
        // Always disconnect - this should not happen, DAPP should always init the connection.
        // A new channelId should be created after connection is removed.
        // On first launch reconnect is set to false even if there was a previous existing connection in another instance.
        // To avoid hanging on the socket forever, we automatically close it after 5seconds.
        Logger.log(`Connection::on received 'clients_waiting' event`);
        Logger.log(
          `Connection::on 'clients_waiting' -- disconnect hanging socket`,
        );
        this.removeConnection();
      });
    }
  }

  private setupBridge(originatorInfo: OriginatorInfo) {
    Logger.log(
      `Connection::setupBridge initialize BackgroundBridge`,
      originatorInfo,
    );
    if (this.backgroundBridge) {
      console.warn(`backrground bridge already setup`);
      return;
    }
    this.backgroundBridge = new BackgroundBridge({
      webview: null,
      url: originatorInfo?.url,
      isRemoteConn: true,
      sendMessage: this.sendMessage,
      getApprovedHosts: () => this.getApprovedHosts('backgroundBridge'),
      remoteConnHost: this.host,
      getRpcMethodMiddleware: ({
        getProviderState,
      }: {
        hostname: string;
        getProviderState: any;
      }) =>
        getRpcMethodMiddleware({
          hostname: this.host,
          getProviderState,
          navigation: null, //props.navigation,
          getApprovedHosts: () => this.getApprovedHosts('rpcMethodMiddleWare'),
          setApprovedHosts: () => null,
          approveHost: (approveHostname) =>
            this.approveHost({
              host: this.host,
              hostname: approveHostname,
            }),
          // Website info
          url: {
            current: originatorInfo?.url ?? CONNECTION_CONFIG.unknownParam,
          },
          title: {
            current: originatorInfo?.title ?? CONNECTION_CONFIG.unknownParam,
          },
          icon: { current: undefined },
          // Bookmarks
          isHomepage: () => false,
          // Show autocomplete
          fromHomepage: { current: false },
          // Wizard
          wizardScrollAdjusted: { current: false },
          tabId: '',
          isWalletConnect: false,
          analytics: {
            isRemoteConn: true,
            platform: parseSource(
              originatorInfo?.platform ?? CONNECTION_CONFIG.unknownParam,
            ),
          },
          toggleUrlModal: () => null,
          injectHomePageScripts: () => null,
        }),
      isMainFrame: true,
      isWalletConnect: false,
      wcRequestActions: undefined,
    });
  }

  private async checkPermissions() {
    // only ask approval if needed
    const approved = this.isApproved({
      channelId: this.host,
      context: 'checkPermission',
    });
    Logger.log(
      `Connection::checkPermissions channel=${this.channelId} approved=${approved}`,
    );
    if (approved) {
      return;
    }

    // TODO can we automatically set the keyring controller if hosts is approved?
    // const keyringController = (
    //   Engine.context as { KeyringController: KeyringController }
    // ).KeyringController;
    // keyringController.state

    const approvalController = (
      Engine.context as { ApprovalController: ApprovalController }
    ).ApprovalController;

    // Request new otp
    // TODO check if an approval is already in progress or add it.
    if (approvalController.has({ id: this.host })) {
      // Request already pending, nothing todo.
      const response = approvalController.get(this.host);
      Logger.log(
        `Connection::checkPermissions channel=${this.channelId} Approval request already pending.`,
        response,
      );
      // Clear prev requests.
      return;
    }

    Logger.log(
      `Connection::checkPermissions channel=${this.channelId} creating approval request`,
      this.originatorInfo,
    );
    // await approvalController.add({
    //   origin: this.host,
    //   type: ApprovalTypes.CONNECT_ACCOUNTS,
    //   requestData: {
    //     hostname: this.originatorInfo?.title ?? '',
    //     pageMeta: {
    //       reconnect: this.reconnect,
    //       url: this.originatorInfo?.url ?? '',
    //       title: this.originatorInfo?.title ?? '',
    //       icon: '',
    //       analytics: {
    //         request_source: AppConstants.REQUEST_SOURCES.SDK_REMOTE_CONN,
    //         request_platform: parseSource(
    //           this.originatorInfo?.platform ?? CONNECTION_CONFIG.unknownParam,
    //         ),
    //       },
    //     },
    //   },
    //   id: this.channelId,
    // });
    // this.revalidate({ channelId: this.channelId });

    // // ApprovalController.accept(id, requestData);

    // // const preferencesController = (
    // //   Engine.context as { PreferencesController: PreferencesController }
    // // ).PreferencesController;
    // // preferencesController.setSelectedAddress();

    // Logger.log(`approval_result`, approvalResult);
  }

  pause() {
    this.remote.pause();
  }

  resume() {
    this.remote.resume();
  }

  disconnect({ terminate }: { terminate: boolean }) {
    if (terminate) {
      this.remote.sendMessage({ type: MessageType.TERMINATE });
    }
    this.remote.disconnect();
  }

  removeConnection() {
    this.isReady = false;
    this.disconnect({ terminate: true });
    this.backgroundBridge?.onDisconnect();
  }

  sendMessage(msg: any) {
    Logger.log(
      `Connection::sendMessage requestsToRedirect`,
      this.requestsToRedirect,
    );
    this.remote.sendMessage(msg);
    if (!this.requestsToRedirect[msg?.data?.id]) return;
    delete this.requestsToRedirect[msg?.data?.id];

    if (this.origin === AppConstants.DEEPLINKS.ORIGIN_QR_CODE) return;

    setTimeout(() => {
      if (!Object.keys(this.requestsToRedirect).length) Minimizer.goBack();
    }, 500);
  }
}

export class SDKConnect extends EventEmitter2 {
  private static instance: SDKConnect;

  private reconnected = false;
  private _initialized = false;
  private timeout?: number;
  private initTimeout?: number;
  private paused = false;
  private appState?: string;
  /**
   * Flag to detect if the app has already been active and was recovered from the background state (AppState).
   * Useful to detect if it was previously killed or sent to sleep from background task.
   */
  private wasActiveOrRecoveredFromBackgroundState = false;
  private connected: ConnectedSessions = {};
  private connections: SDKSessions = {};
  private connecting: { [channelId: string]: boolean } = {};
  private approvedHosts: ApprovedHosts = {};
  private sdkLoadingState: { [channelId: string]: boolean } = {};
  // Contains the list of hosts that have been temporarily disabled because of a re-connection.
  // This is a security measure to prevent session hi-jacking.
  private disabledHosts: ApprovedHosts = {};

  private SDKConnect() {
    // Keep empty to manage singleton
  }

  public async connectToChannel({
    id,
    otherPublicKey,
    origin,
  }: ConnectionProps) {
    if (this.connecting[id]) {
      Logger.log(`connection already in progress...`);
      return;
    }

    this.connecting[id] = true;
    const existingConnection = this.connected[id];
    Logger.log(`SDKConnect::connectToChannel() channel=${id}`);
    if (existingConnection) {
      // Was previously started
      this.reconnect({ channelId: id });
      return;
    }

    // if (!newChannel) {
    //   // Did we already reconnect
    //   if (this.reconnected) {
    //     // Already reconnected to the channel
    //     Logger.log(
    //       `SDKConnect::connectToChannel() Already reconnected with init. GGGGGG`,
    //     );
    //   }

    //   Logger.log(`remote is `, this.connected[id]);
    //   // Skip if already connected
    //   if (this.connected[id]?.remote?.isConnected()) {
    //     Logger.log(
    //       `SDKConnect::connectToChannel() id=${id} existing -- already connected. GGGGGG`,
    //     );
    //     // this.removeChannel(id);
    //     // this.connected[id].resume();
    //     return;
    //   }
    //   Logger.log(`GGGGGG SURE WHAT TO DO NOW???`);

    //   // // did we previously connect to this channel?
    //   // if (this.connections[id]) {
    //   //   this.reconnect({ channelId: id });
    //   //   return;
    //   // }

    //   Logger.log(`establishing new connection`, newChannel);
    // }

    // Adding a connecting check because connectToChannel can be doubled called from deeplink.
    // The second calls happen before SDK.connected[id] is set and thus creating double connection.
    this.connections[id] = {
      id,
      otherPublicKey,
      origin,
      validUntil: Date.now() + DEFAULT_SESSION_TIMEOUT_MS,
    };
    Logger.log(
      `SDKConnect::connectToChannel() id=${id}, origin=${origin}`,
      otherPublicKey,
    );
    this.connected[id] = new Connection({
      ...this.connections[id],
      updateOriginatorInfos: this.updateOriginatorInfos.bind(this),
      approveHost: this._approveHost.bind(this),
      disapprove: this.disapprove.bind(this),
      getApprovedHosts: this.getApprovedHosts.bind(this),
      revalidate: this.revalidateChannel.bind(this),
      isApproved: this.isApproved.bind(this),
      onTerminate: ({ channelId }) => {
        this.removeChannel(channelId);
      },
    });
    // Make sure to watch event before you connect
    this.watchConnection(this.connected[id]);
    DefaultPreference.set(
      AppConstants.MM_SDK.SDK_CONNECTIONS,
      JSON.stringify(this.connections),
    );
    // Initialize connection
    this.connected[id].connect({
      withKeyExchange: !!this.wasActiveOrRecoveredFromBackgroundState,
    });
    this.emit('refresh');
    this.connecting[id] = false;
  }

  private watchConnection(connection: Connection) {
    connection.remote.on(
      EventType.CONNECTION_STATUS,
      (connectionStatus: ConnectionStatus) => {
        if (connectionStatus === ConnectionStatus.TERMINATED) {
          Logger.log(`SHOULD DISCONNECT channel=${connection.channelId} HERE`);
          this.removeChannel(connection.channelId);
        }
      },
    );
    connection.on(CONNECTION_LOADING_EVENT, (event: { loading: boolean }) => {
      const channelId = connection.channelId;
      const { loading } = event;
      Logger.log(`received event ${loading}`, event);
      this.updateSDKLoadingState({ channelId, loading });
    });
  }

  public updateSDKLoadingState({
    channelId,
    loading,
  }: {
    channelId: string;
    loading: boolean;
  }) {
    if (loading === true) {
      this.sdkLoadingState[channelId] = true;
    } else {
      delete this.sdkLoadingState[channelId];
    }

    const loadingSessions = Object.keys(this.sdkLoadingState).length;
    Logger.log(
      `SDKConnect::updateSDKLoadingState loading sessions=${loadingSessions} channelId=${channelId} loading=${loading}`,
    );
    store.dispatch(toggleSDKLoadingModal(loadingSessions > 0));
  }

  public updateOriginatorInfos({
    channelId,
    originatorInfo,
  }: {
    channelId: string;
    originatorInfo: OriginatorInfo;
  }) {
    this.connections[channelId].originatorInfo = originatorInfo;
    DefaultPreference.set(
      AppConstants.MM_SDK.SDK_CONNECTIONS,
      JSON.stringify(this.connections),
    );
  }

  public resume({ channelId }: { channelId: string }) {
    Logger.log(`SDKConnect::resume() channelId=${channelId}`);
    const session = this.connected[channelId]?.remote;
    if (session && !session?.isConnected()) {
      this.connecting[channelId] = true;
      this.connected[channelId].resume();
      this.connecting[channelId] = false;
    }
    Logger.log(`SDKConnected::resume channelId=${channelId} has resumed`);
  }

  async reconnect({ channelId }: { channelId: string }) {
    if (this.connecting[channelId]) {
      Logger.log(`SDKConnect::reconnect -- connection already in progress...`);
      return;
    }

    if (!this.connections[channelId]) {
      Logger.log(
        `JJJJJJJJJJJJJJJJJJJJJJJJJJ invalid sdk state ${channelId} not found.`,
      );
      return;
    }

    const existingConnection = this.connected[channelId];

    if (existingConnection) {
      const connected = existingConnection?.remote.isConnected();
      const ready = existingConnection?.remote.isReady();
      const keysExchanged =
        !!existingConnection?.remote.getKeyInfo()?.keysExchanged;
      Logger.log(
        `SDKConnect::reconnect() existing channel=${channelId} connected=${connected} ready=${ready} keysExchanged=${keysExchanged}`,
      );
      if (connected) {
        // When does this happen?
        Logger.log(`this::reconnect() interrupted - already connected.`);
        return;
      }
    }

    Logger.log(
      `Establishing reconnection... recoveredFromBackgroundState=${this.wasActiveOrRecoveredFromBackgroundState}`,
    );
    const connection = this.connections[channelId];
    this.connecting[channelId] = true;
    this.connected[channelId] = new Connection({
      ...connection,
      reconnect: true,
      approveHost: this._approveHost.bind(this),
      disapprove: this.disapprove.bind(this),
      getApprovedHosts: this.getApprovedHosts.bind(this),
      revalidate: this.revalidateChannel.bind(this),
      isApproved: this.isApproved.bind(this),
      updateOriginatorInfos: this.updateOriginatorInfos.bind(this),
      // eslint-disable-next-line @typescript-eslint/no-shadow
      onTerminate: ({ channelId }) => {
        this.removeChannel(channelId);
      },
    });
    this.connected[channelId].connect({
      withKeyExchange: !!this.wasActiveOrRecoveredFromBackgroundState,
    });
    this.watchConnection(this.connected[channelId]);
    this.emit('refresh');
    this.connecting[channelId] = false;
  }

  async reconnectAll() {
    Logger.log(
      `SDKConnect::reconnectAll() this.reconnected=${this.reconnected}`,
    );
    if (this.reconnected) {
      Logger.log(`SDKConnect::reconnectAll() Already reconnected -- skip`);
      return;
    }

    const channelIds = Object.keys(this.connections);
    channelIds.forEach((channelId) => {
      if (channelId) {
        this.reconnect({ channelId });
      }
    });
    this.reconnected = true;
  }

  setSDKSessions(sdkSessions: SDKSessions) {
    this.connections = sdkSessions;
  }

  public pause() {
    Logger.log(`SDKConnect::pause()`);
    if (this.paused) return;

    for (const id in this.connected) {
      this.connected[id].pause();
    }
    this.paused = true;
  }

  public removeChannel(channelId: string) {
    if (this.connected[channelId]) {
      this.connected[channelId].removeConnection();
      delete this.connected[channelId];
      delete this.connections[channelId];
      delete this.connecting[channelId];
      delete this.approvedHosts[MM_SDK_REMOTE_ORIGIN + channelId];
      DefaultPreference.set(
        AppConstants.MM_SDK.SDK_CONNECTIONS,
        JSON.stringify(this.connections),
      );
      this.emit('refresh');
    }
  }

  public removeAll() {
    Logger.log(`SDKConnect::removeAll()`);
    for (const id in this.connections) {
      this.removeChannel(id);
    }
    // Also remove approved hosts that may have been skipped.
    this.approvedHosts = {};
    this.connections = {};
    this.connected = {};
    this.connecting = {};
    DefaultPreference.clear(AppConstants.MM_SDK.SDK_CONNECTIONS);
  }

  public getConnected() {
    return this.connected;
  }

  public getConnections() {
    return this.connections;
  }

  public getApprovedHosts(context?: string) {
    Logger.log(
      `SDKConnnect::getApprovedHosts() context=${context} `,
      this.approvedHosts,
    );
    return this.approvedHosts || {};
  }

  public disapprove(channelId: string) {
    const hostname = MM_SDK_REMOTE_ORIGIN + channelId;
    Logger.log(
      `SDKConnect::disapprove hostname=${hostname}`,
      this.approvedHosts,
    );
    delete this.approvedHosts[hostname];
    this.emit('refresh');
  }

  public async revalidateChannel({ channelId }: { channelId: string }) {
    Logger.log(`SDKConnect::revalidateChannel() channelId=${channelId}`);
    const hostname = MM_SDK_REMOTE_ORIGIN + channelId;
    // if (this.disabledHosts[hostname]) {
    this._approveHost({ host: hostname, hostname });

    // this.connected[channelId]?.resume();
    // } else {
    //   // this is not supposed to happen
    //   Logger.log(`SDKConnect::revalidateChannel invalid channel ${channelId}`);
    // }
    this.emit('refresh');
  }

  public isApproved({
    channelId,
    context,
  }: {
    channelId: string;
    context?: string;
  }) {
    const hostname = MM_SDK_REMOTE_ORIGIN + channelId;
    const isApproved = this.approvedHosts[hostname] !== undefined;
    // possible future feature to add multiple approval parameters per channel.
    Logger.log(
      `SDKConnect::isApproved approved=${isApproved} context=${context} ${channelId} -> ${hostname}`,
    );
    return isApproved;
  }

  private _approveHost({ host, hostname }: approveHostProps) {
    Logger.log(`SDKConnect::_approveHost host=${host} hostname=${hostname}`);
    this.approvedHosts[host] = hostname;
    const approvalController = (
      Engine.context as { ApprovalController: ApprovalController }
    ).ApprovalController;

    // Request new otp
    // TODO check if an approval is already in progress or add it.
    if (approvalController.has({ id: host })) {
      Logger.log(`APPROVING now`);
      // approvalController.accept(host);
    }
  }

  private _handleAppState(appState: string) {
    Logger.log(
      `SDKConnect::handleAppState() state has changed appState=${appState}`,
    );
    this.appState = appState;
    if (appState === 'active') {
      if (Device.isAndroid()) {
        if (this.timeout) BackgroundTimer.clearInterval(this.timeout);
      } else if (this.timeout) clearTimeout(this.timeout);

      if (this.paused) {
        this.reconnected = false;
        this.paused = false;
        for (const id in this.connected) {
          this.resume({ channelId: id });
        }
      }
    } else if (appState === 'background') {
      this.wasActiveOrRecoveredFromBackgroundState = true;
      if (!this.paused) {
        /**
         * Pause connections after 20 seconds of the app being in background to respect device resources.
         * Also, OS closes the app if after 30 seconds, the connections are still open.
         */
        if (Device.isIos()) {
          BackgroundTimer.start();
          this.timeout = setTimeout(() => {
            Logger.log(
              `SDKConnect::handleAppState::ios -- timeout reached -- calling this.pause()`,
            );
            this.pause();
          }, TIMEOUT_PAUSE_CONNECTIONS) as unknown as number;
          BackgroundTimer.stop();
        } else if (Device.isAndroid()) {
          this.timeout = BackgroundTimer.setTimeout(() => {
            Logger.log(
              `SDKConnect::handleAppState::android -- timeout reached -- calling this.pause()`,
            );
            this.pause();
          }, TIMEOUT_PAUSE_CONNECTIONS);
          // TODO manage interval clearTimeout
        }
      }
    }
  }

  public async unmount() {
    Logger.log(`SDKConnect::unmount()`);
    AppState.removeEventListener('change', this._handleAppState.bind(this));
    // Disconnect all connections - especially useful during dev otherwise rooms gets full.
    this.pause();
    if (this.timeout) clearTimeout(this.timeout);
    if (this.initTimeout) clearTimeout(this.initTimeout);
  }

  getSessionsStorage() {
    return this.connections;
  }

  public async init() {
    if (this._initialized) {
      Logger.log(`SDKConnect::init already initialized.`);
      return;
    }

    AppState.removeEventListener('change', this._handleAppState.bind(this));
    AppState.addEventListener('change', this._handleAppState.bind(this));

    const [connectionsStorage] = await Promise.all([
      DefaultPreference.get(AppConstants.MM_SDK.SDK_CONNECTIONS),
    ]);

    if (connectionsStorage) {
      this.connections = JSON.parse(connectionsStorage);
    }

    // this.initTimeout = setTimeout(() => {
    // Need to use a timeout to avoid race condition of double reconnection
    // - reconnecting from deeplink and reconnecting from being back in foreground.
    // We prioritize the deeplink and thus use the delay on foregroun.
    Logger.log(
      `SDKConnect::init reconnect`,
      JSON.stringify(this.connections, null, 4),
    );
    this.reconnectAll();
    this.wasActiveOrRecoveredFromBackgroundState = true;
    // }, 1000) as unknown as number;

    this._initialized = true;
  }

  public static getInstance(): SDKConnect {
    if (!SDKConnect.instance) {
      SDKConnect.instance = new SDKConnect();
    }
    return SDKConnect.instance;
  }
}

export default SDKConnect;
