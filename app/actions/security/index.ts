/* eslint-disable import/prefer-default-export */
import type { Action as ReduxAction } from 'redux';

export enum ActionType {
  SET_ALLOW_LOGIN_WITH_REMEMBER_ME = 'SET_ALLOW_LOGIN_WITH_REMEMBER_ME',
  SET_AUTOMATIC_SECURITY_CHECKS = 'SET_AUTOMATIC_SECURITY_CHECKS',
  USER_SELECTED_AUTOMATIC_SECURITY_CHECKS_OPTION = 'USER_SELECTED_AUTOMATIC_SECURITY_CHECKS_OPTION',
  SET_AUTOMATIC_SECURITY_CHECKS_MODAL_OPEN = 'SET_AUTOMATIC_SECURITY_CHECKS_MODAL_OPEN',
  SET_DATA_COLLECTION_FOR_MARKETING = 'SET_DATA_COLLECTION_FOR_MARKETING',
  SET_NFT_AUTO_DETECTION_MODAL_OPEN = 'SET_NFT_AUTO_DETECTION_MODAL_OPEN',
  SET_MULTI_RPC_MIGRATION_MODAL_OPEN = 'SET_MULTI_RPC_MIGRATION_MODAL_OPEN',
}

export interface AllowLoginWithRememberMeUpdated
  extends ReduxAction<ActionType.SET_ALLOW_LOGIN_WITH_REMEMBER_ME> {
  enabled: boolean;
}

export interface AutomaticSecurityChecks
  extends ReduxAction<ActionType.SET_AUTOMATIC_SECURITY_CHECKS> {
  enabled: boolean;
}

export interface UserSelectedAutomaticSecurityChecksOptions
  extends ReduxAction<ActionType.USER_SELECTED_AUTOMATIC_SECURITY_CHECKS_OPTION> {
  selected: boolean;
}

export interface SetAutomaticSecurityChecksModalOpen
  extends ReduxAction<ActionType.SET_AUTOMATIC_SECURITY_CHECKS_MODAL_OPEN> {
  open: boolean;
}

export interface SetNftAutoDetectionModalOpen
  extends ReduxAction<ActionType.SET_NFT_AUTO_DETECTION_MODAL_OPEN> {
  open: boolean;
}

export interface SetMultiRpcMigrationModalOpen
  extends ReduxAction<ActionType.SET_MULTI_RPC_MIGRATION_MODAL_OPEN> {
  open: boolean;
}

export interface SetDataCollectionForMarketing
  extends ReduxAction<ActionType.SET_DATA_COLLECTION_FOR_MARKETING> {
  enabled: boolean;
}

export type Action =
  | AllowLoginWithRememberMeUpdated
  | AutomaticSecurityChecks
  | UserSelectedAutomaticSecurityChecksOptions
  | SetAutomaticSecurityChecksModalOpen
  | SetDataCollectionForMarketing
  | SetNftAutoDetectionModalOpen
  | SetMultiRpcMigrationModalOpen;

export const setAllowLoginWithRememberMe = (
  enabled: boolean,
): AllowLoginWithRememberMeUpdated => ({
  type: ActionType.SET_ALLOW_LOGIN_WITH_REMEMBER_ME,
  enabled,
});

export const setAutomaticSecurityChecks = (
  enabled: boolean,
): AutomaticSecurityChecks => ({
  type: ActionType.SET_AUTOMATIC_SECURITY_CHECKS,
  enabled,
});

export const userSelectedAutomaticSecurityChecksOptions =
  (): UserSelectedAutomaticSecurityChecksOptions => ({
    type: ActionType.USER_SELECTED_AUTOMATIC_SECURITY_CHECKS_OPTION,
    selected: true,
  });

export const setAutomaticSecurityChecksModalOpen = (
  open: boolean,
): SetAutomaticSecurityChecksModalOpen => ({
  type: ActionType.SET_AUTOMATIC_SECURITY_CHECKS_MODAL_OPEN,
  open,
});

export const setNftAutoDetectionModalOpen = (
  open: boolean,
): SetNftAutoDetectionModalOpen => ({
  type: ActionType.SET_NFT_AUTO_DETECTION_MODAL_OPEN,
  open,
});

export const setMultiRpcMigrationModalOpen = (
  open: boolean,
): SetMultiRpcMigrationModalOpen => ({
  type: ActionType.SET_MULTI_RPC_MIGRATION_MODAL_OPEN,
  open,
});

export const setDataCollectionForMarketing = (enabled: boolean) => ({
  type: ActionType.SET_DATA_COLLECTION_FOR_MARKETING,
  enabled,
});
