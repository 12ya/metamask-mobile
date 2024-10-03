import React from 'react';
import useApprovalRequest from '@components/Views/confirmations/hooks/useApprovalRequest';
import { ApprovalTypes } from '@core/RPCMethods/RPCMethodMiddleware';
import ApprovalModal from '@components/Approvals/ApprovalModal';
import AccountApproval from '@components/UI/AccountApproval';

export interface ConnectApprovalProps {
  // TODO: Replace "any" with type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: any;
}

const ConnectApproval = (props: ConnectApprovalProps) => {
  const { approvalRequest, pageMeta, onConfirm, onReject } =
    useApprovalRequest();

  return (
    <ApprovalModal
      isVisible={approvalRequest?.type === ApprovalTypes.CONNECT_ACCOUNTS}
      onCancel={onReject}
    >
      <AccountApproval
        onCancel={onReject}
        onConfirm={onConfirm}
        navigation={props.navigation}
        currentPageInformation={pageMeta}
      />
    </ApprovalModal>
  );
};

export default ConnectApproval;
