import React from 'react';
import { showModalDialog } from '../../../../core/services/ModalDialogService';
import InServiceDialog from './Dialogs/InServiceDialog';
import { PreservedTag } from './types';
import { backToListButton } from './ScopeOverview';
import { showSnackbarNotification } from '../../../../core/services/NotificationService';
import TransferDialog from './Dialogs/TransferDialog';
import { transfer } from './apiCalls';
import {
    refreshScopeListCallback,
    moduleAreaHeight,
    moduleHeaderHeight,
} from './useRefHooksAndStates';

interface ShowInServiceDialogParams {
    selectedTags: PreservedTag[];
    setInService: () => void;
}

export const showInServiceDialog = ({
    selectedTags,
    setInService,
}: ShowInServiceDialogParams): void => {
    const inServiceTags: PreservedTag[] = [];
    const notInServiceTags: PreservedTag[] = [];
    selectedTags.map((tag) => {
        const newTag: PreservedTag = { ...tag };
        if (tag.readyToBeSetInService) {
            inServiceTags.push(newTag);
        } else {
            notInServiceTags.push(newTag);
        }
    });

    const inServiceButton = inServiceTags.length > 0 ? 'Set in service' : null;
    const inServiceFunc = inServiceTags.length > 0 ? setInService : null;

    showModalDialog(
        'Setting in service',
        <InServiceDialog
            inServiceTags={inServiceTags}
            notInServiceTags={notInServiceTags}
        />,
        '80vw',
        backToListButton,
        null,
        inServiceButton,
        inServiceFunc
    );
};

interface TransferDialogParams {
    selectedTags: PreservedTag[];
    apiClient: {
        transfer: (tags: { id: number; rowVersion: string }[]) => Promise<void>;
    };
    refreshScopeList: () => void;
    refreshFilterValues: () => void;
    showSnackbarNotification: (message: string, duration?: number) => void;
    backToListButton: string;
}

export const transferDialog = ({
    selectedTags,
    apiClient,
    refreshScopeList,
    refreshFilterValues,
    showSnackbarNotification,
    backToListButton,
}: TransferDialogParams): void => {
    //Tag-objects must be cloned to avoid issues with data in scope table
    const transferableTags: PreservedTag[] = [];
    const nonTransferableTags: PreservedTag[] = [];

    selectedTags.map((tag) => {
        const newTag: PreservedTag = { ...tag };
        if (tag.readyToBeTransferred && !tag.isVoided) {
            transferableTags.push(newTag);
        } else {
            nonTransferableTags.push(newTag);
        }
    });

    const transferButton = transferableTags.length > 0 ? 'Transfer' : null;
    const transferFunc =
        transferableTags.length > 0
            ? () =>
                  transfer({
                      apiClient,
                      transferableTags,
                      refreshScopeList,
                      refreshFilterValues,
                      showSnackbarNotification,
                  })
            : null;

    showModalDialog(
        'Transferring',
        <TransferDialog
            transferableTags={transferableTags}
            nonTransferableTags={nonTransferableTags}
        />,
        '80vw',
        backToListButton,
        null,
        transferButton,
        transferFunc
    );
};
