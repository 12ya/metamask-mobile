import { Notification } from '../types';
import { NotificationServicesController } from '@metamask/notification-services-controller';

type TRIGGER_TYPES = NotificationServicesController.Constants.TRIGGER_TYPES;
/**
 * TODO - remove this once we upgrade TS.
 * There is a typescript compiler bug where Extract does not fully compute unions, which is fixed in a later version
 * GH Issue: https://github.com/MetaMask/metamask-mobile/issues/10364
 * */

type CustomExtract<T, U> = T extends T
  ? U extends Partial<T>
    ? T
    : never
  : never;

export type ExtractedNotification<NodeType extends TRIGGER_TYPES> =
  NodeType extends NodeType
    ? CustomExtract<Notification, { type: NodeType }>
    : never;

export const isOfTypeNodeGuard =
  <NodeType extends Notification['type']>(types: NodeType[]) =>
  (n: Notification): n is ExtractedNotification<NodeType> =>
    types.includes(n.type as NodeType);
