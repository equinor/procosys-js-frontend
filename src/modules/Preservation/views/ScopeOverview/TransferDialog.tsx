import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import DialogTable from './DialogTable';
import { Column } from 'material-table';

interface TransferDialogProps {
    transferableTags: PreservedTag[];
    nonTransferableTags: PreservedTag[];
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

const TransferDialog = ({
    transferableTags,
    nonTransferableTags
}: TransferDialogProps): JSX.Element => {

    return (<div>
        {nonTransferableTags.length > 0 && (
            <div>
                <Typography variant="meta">{nonTransferableTags.length} tag(s) cannot be transferred. Tags are not started, already completed or voided.</Typography>
                <DialogTable tags={nonTransferableTags} columns={columns} toolbarText='tag(s) cannot be transferred' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
            </div>
        )}
        {transferableTags.length > 0 && (
            <DialogTable tags={transferableTags} columns={columns} toolbarText='tag(s) will be transferred' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
        )}
    </div>
    );
};

export default TransferDialog;
