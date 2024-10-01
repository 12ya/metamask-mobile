import { strings } from '@locales/i18n';
import {
  ModalFieldType,
  ModalFooterType,
  TRIGGER_TYPES,
} from '@util/constants';
import { ExtractedNotification, isOfTypeNodeGuard } from '@util/node-guard';
import {
  label_address_from,
  label_address_to,
  NotificationState,
} from '@util/types/NotificationState';
import {
  getAmount,
  getNativeTokenDetailsByChainId,
  getNetworkFees,
  getNotificationBadge,
} from '@util/methods/common';
import { getTokenAmount, getTokenUSDAmount } from '@util/token-amounts';
import { formatAddress } from '@util/address';

type ERC20Notification = ExtractedNotification<
  TRIGGER_TYPES.ERC20_RECEIVED | TRIGGER_TYPES.ERC20_SENT
>;

const isERC20Notification = isOfTypeNodeGuard([
  TRIGGER_TYPES.ERC20_RECEIVED,
  TRIGGER_TYPES.ERC20_SENT,
]);

const isSent = (n: ERC20Notification) => n.type === TRIGGER_TYPES.ERC20_SENT;

const menuTitle = (n: ERC20Notification) => {
  const address = formatAddress(isSent(n) ? n.data.to : n.data.from, 'short');
  return strings(`notifications.menu_item_title.${n.type}`, {
    address,
  });
};

const modalTitle = (n: ERC20Notification) =>
  isSent(n)
    ? strings('notifications.modal.title_sent', { symbol: n.data.token.symbol })
    : strings('notifications.modal.title_received', {
        symbol: n.data.token.symbol,
      });

const state: NotificationState<ERC20Notification> = {
  guardFn: isERC20Notification,
  createMenuItem: (notification) => ({
    title: menuTitle(notification),

    description: {
      start: notification.data.token.name,
      end: `${getAmount(
        notification.data.token.amount,
        notification.data.token.decimals,
        {
          shouldEllipse: true,
        },
      )} ${notification.data.token.symbol}`,
    },

    image: {
      url: notification.data.token.image,
    },

    badgeIcon: getNotificationBadge(notification.type),

    createdAt: notification.createdAt.toString(),
  }),
  createModalDetails: (notification) => {
    const nativeTokenDetails = getNativeTokenDetailsByChainId(
      notification.chain_id,
    );
    return {
      title: modalTitle(notification),
      createdAt: notification.createdAt.toString(),
      fields: [
        {
          type: ModalFieldType.ADDRESS,
          label: label_address_from(notification),
          address: notification.data.from,
        },
        {
          type: ModalFieldType.ADDRESS,
          label: label_address_to(notification),
          address: notification.data.to,
        },
        {
          type: ModalFieldType.TRANSACTION,
          txHash: notification.tx_hash,
        },
        {
          type: ModalFieldType.ASSET,
          label: strings('notifications.modal.label_asset'),
          description: notification.data.token.name,
          amount: getTokenAmount(notification.data.token),
          usdAmount: getTokenUSDAmount(notification.data.token),
          tokenIconUrl: notification.data.token.image,
          tokenNetworkUrl: nativeTokenDetails?.image,
        },
        {
          type: ModalFieldType.NETWORK,
          iconUrl: nativeTokenDetails?.image,
          name: nativeTokenDetails?.name,
        },
        {
          type: ModalFieldType.NETWORK_FEE,
          getNetworkFees: () => getNetworkFees(notification),
        },
      ],
      footer: {
        type: ModalFooterType.BLOCK_EXPLORER,
        chainId: notification.chain_id,
        txHash: notification.tx_hash,
      },
    };
  },
};

export default state;
