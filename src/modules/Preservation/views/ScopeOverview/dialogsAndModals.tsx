import React from 'react';
import { showModalDialog } from '../../../../core/services/ModalDialogService';
import InServiceDialog from './Dialogs/InServiceDialog';
import { PreservedTag } from './types';
import { backToListButton } from './ScopeOverview';

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
