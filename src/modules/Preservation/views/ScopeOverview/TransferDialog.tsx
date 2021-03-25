import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import DialogTable from './DialogTable';
import { TableOptions, UseTableRowProps } from 'react-table';

interface TransferDialogProps {
    transferableTags: PreservedTag[];
    nonTransferableTags: PreservedTag[];
}

const getRequirementIcons = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <RequirementIcons tag={tag} />
    );
};

const columns = [
    { Header: 'Tag nr', accessor: 'tagNo' },
    { Header: 'Description', accessor: 'description' },
    { Header: 'From mode', accessor: 'mode' },
    { Header: 'From resp', accessor: 'responsibleCode' },
    { Header: 'To mode', accessor: 'nextMode' },
    { Header: 'To resp', accessor: 'nextResponsibleCode' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Req type', accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d, Cell: getRequirementIcons }
];

const TransferDialog = ({
    transferableTags,
    nonTransferableTags
}: TransferDialogProps): JSX.Element => {

    return (<div style={{ height: '70vh' }}>
        {nonTransferableTags.length > 0 && (
            <div style={{ height: '50%' }}>
                <Typography variant="meta">{nonTransferableTags.length} tag(s) cannot be transferred. Tags are not started, already completed or voided.</Typography>
                <DialogTable tags={nonTransferableTags} columns={columns} toolbarText='tag(s) cannot be transferred' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
            </div>
        )}
        {transferableTags.length > 0 && (
            <div style={{ height: '50%' }}>
                <DialogTable tags={transferableTags} columns={columns} toolbarText='tag(s) will be transferred' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
            </div>
        )}
    </div>
    );
};

export default TransferDialog;
