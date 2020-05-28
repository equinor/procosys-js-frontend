import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import DialogTable from './DialogTable';
import { Column } from 'material-table';
import { showModalDialog } from '@procosys/core/services/ModalDialogService';
import { render } from 'react-dom';
import { showSnackbarNotification } from '@procosys/core/services/NotificationService';
import PreservationApiClient from '../../http/PreservationApiClient';

interface TransferDialogProps {
    selectedTags: PreservedTag[];
}

interface NewProps {
    selectedTags: PreservedTag[];
    clearSelected: () => void;
    apiClient: PreservationApiClient;
}

const getRequirementIcons = (tag: PreservedTag): JSX.Element => {
    return (
        <RequirementIcons tag={tag} />
    );
};

const columns: Column<any>[] = [
    { title: 'Tag nr', field: 'tagNo' },
    { title: 'Description', field: 'description' },
    { title: 'From Mode', field: 'mode' },
    { title: 'From Resp', field: 'responsibleCode' },
    { title: 'To Mode', field: 'nextMode' },
    { title: 'To Resp', field: 'nextResponsibleCode' },
    { title: 'Status', field: 'status' },
    { title: 'Req type', render: getRequirementIcons }
];

const TransferDialogBody = ({
    selectedTags
}: TransferDialogProps): JSX.Element => {

    const transferableTags = selectedTags.filter(tag => tag.readyToBeTransferred);
    const nonTransferableTags = selectedTags.filter(tag => !tag.readyToBeTransferred);
    return (<div>
        {nonTransferableTags.length > 0 && (
            <div>
                <Typography variant="meta">{nonTransferableTags.length} tag(s) cannot be transferred. Tags are not started/already completed.</Typography>
                <DialogTable tags={nonTransferableTags} columns={columns} toolbarText='tag(s) will not be transferred' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
            </div>
        )}
        {transferableTags.length > 0 && (
            <DialogTable tags={transferableTags} columns={columns} toolbarText='tag(s) will be transferred' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
        )}
    </div>
    );
};

const transferDialog = ({
    selectedTags,
    clearSelected,
    apiClient}: NewProps): any => {

    const hasTransferableTags = selectedTags.some(tag => tag.readyToBeTransferred);

    const transfer = async (): Promise<void> => {
        try {
            const tags = selectedTags.filter(tag => tag.readyToBeTransferred);
            await apiClient.transfer(tags.map(t => ({
                id: t.id,
                rowVersion: t.rowVersion
            })));
            clearSelected();
            showSnackbarNotification(`${tags.length} tag(s) have been successfully transferred.`);
        } catch (error) {
            console.error('Transfer failed: ', error.messsage, error.data);
            showSnackbarNotification(error.message);
        }
        return Promise.resolve();
    };

    render(showModalDialog(
        'Transferring',
        <TransferDialogBody selectedTags={selectedTags}  />,
        '80vw',
        'Back to list',
        null,
        hasTransferableTags ? 'Transfer' : null,
        hasTransferableTags ? transfer : null
    ), null);
};

export default transferDialog;
