import { ACTIONS, PREFIXES, PROTOCOLS } from '../../../constants/deeplinks';
import AppConstants from '../../../core/AppConstants';
import DeeplinkManager from '../DeeplinkManager';
import { Minimizer } from '../../../core/NativeModules';
import SDKConnect, {
  DEFAULT_SESSION_TIMEOUT_MS,
} from '../../../core/SDKConnect/SDKConnect';
import DevLogger from '../../../core/SDKConnect/utils/DevLogger';
import WC2Manager from '../../../core/WalletConnect/WalletConnectV2';
import extractURLParams from './extractURLParams';

function handleUniversalLinks({
  instance,
  handled,
  urlObj,
  params,
  browserCallBack,
  origin,
  wcURL,
}: {
  instance: DeeplinkManager;
  handled: () => void;
  urlObj: ReturnType<typeof extractURLParams>['urlObj'];
  params: ReturnType<typeof extractURLParams>['params'];
  browserCallBack: (url: string) => void;
  origin: string;
  wcURL: string;
}) {
  const { MM_UNIVERSAL_LINK_HOST, MM_DEEP_ITMS_APP_LINK } = AppConstants;
  const DEEP_LINK_BASE = `${PROTOCOLS.HTTPS}://${MM_UNIVERSAL_LINK_HOST}`;

  // Universal links
  handled();

  if (urlObj.hostname === MM_UNIVERSAL_LINK_HOST) {
    // action is the first part of the pathname
    const action: ACTIONS = urlObj.pathname.split('/')[1] as ACTIONS;

    if (action === ACTIONS.ANDROID_SDK) {
      DevLogger.log(
        `DeeplinkManager:: metamask launched via android sdk universal link`,
      );
      SDKConnect.getInstance().bindAndroidSDK();
      return;
    }

    if (action === ACTIONS.CONNECT) {
      if (params.redirect) {
        Minimizer.goBack();
      } else if (params.channelId) {
        const connections = SDKConnect.getInstance().getConnections();
        const channelExists = connections[params.channelId] !== undefined;

        if (channelExists) {
          if (origin === AppConstants.DEEPLINKS.ORIGIN_DEEPLINK) {
            // Automatically re-approve hosts.
            SDKConnect.getInstance().revalidateChannel({
              channelId: params.channelId,
            });
          }
          SDKConnect.getInstance().reconnect({
            channelId: params.channelId,
            otherPublicKey: params.pubkey,
            context: 'deeplink (universal)',
            initialConnection: false,
          });
        } else {
          SDKConnect.getInstance().connectToChannel({
            id: params.channelId,
            origin,
            otherPublicKey: params.pubkey,
            validUntil: Date.now() + DEFAULT_SESSION_TIMEOUT_MS,
          });
        }
      }
      return true;
    } else if (action === ACTIONS.WC && wcURL) {
      WC2Manager.getInstance()
        .then((WC2ManagerInstance) =>
          WC2ManagerInstance.connect({
            wcUri: wcURL,
            origin,
            redirectUrl: params?.redirect,
          }),
        )
        .catch((err) => {
          console.warn(`DeepLinkManager failed to connect`, err);
        });
      return;
    } else if (action === ACTIONS.WC) {
      // This is called from WC just to open the app and it's not supposed to do anything
      return;
    } else if (PREFIXES[action]) {
      const deeplinkUrl = urlObj.href.replace(
        `${DEEP_LINK_BASE}/${action}/`,
        PREFIXES[action],
      );
      // loops back to open the link with the right protocol
      instance.parse(deeplinkUrl, { browserCallBack, origin });
    } else if (action === ACTIONS.BUY_CRYPTO) {
      instance._handleBuyCrypto();
    } else {
      // If it's our universal link or Apple store deep link don't open it in the browser
      if (
        (!action &&
          (urlObj.href === `${DEEP_LINK_BASE}/` ||
            urlObj.href === DEEP_LINK_BASE)) ||
        urlObj.href === MM_DEEP_ITMS_APP_LINK
      )
        return;

      // Fix for Apple Store redirect even when app is installed
      if (urlObj.href.startsWith(`${DEEP_LINK_BASE}/`)) {
        instance._handleBrowserUrl(
          `${PROTOCOLS.HTTPS}://${urlObj.href.replace(
            `${DEEP_LINK_BASE}/`,
            '',
          )}`,
          browserCallBack,
        );

        return;
      }

      // Normal links (same as dapp)
      instance._handleBrowserUrl(urlObj.href, browserCallBack);
    }
  } else {
    // Normal links (same as dapp)
    instance._handleBrowserUrl(urlObj.href, browserCallBack);
  }

  // walletconnect related deeplinks
  // address, transactions, etc
}

export default handleUniversalLinks;
