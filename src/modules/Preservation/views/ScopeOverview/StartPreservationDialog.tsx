import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import DialogTable from './DialogTable';
import { TableOptions, UseTableRowProps } from 'react-table';

interface StartPreservationDialogProps {
    startableTags: PreservedTag[];
    nonStartableTags: PreservedTag[];
}

const getRequirementIcons = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <RequirementIcons tag={tag} />
    );
};

const columns = [
    { Header: 'Tag nr', accessor: 'tagNo', id: 'tagNo' },
    { Header: 'Description', accessor: 'description', id: 'description' },
    { Header: 'Status', accessor: 'status', id: 'status' },
    { Header: 'Req type', accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d, id: 'reqtype', Cell: getRequirementIcons }
];

const StartPreservationDialog = ({
    startableTags,
    nonStartableTags
}: StartPreservationDialogProps): JSX.Element => {

    return (<div style={{height: '65vh'}}>
        {nonStartableTags.length > 0 && (
            <div>
                <Typography variant="meta">{nonStartableTags.length} tag(s) cannot be started. Tags are already started, or are voided.</Typography>
                <DialogTable tags={nonStartableTags} columns={columns} toolbarText='tag(s) will not be started' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
            </div>
        )}
        {startableTags.length > 0 && (
            <DialogTable tags={startableTags} columns={columns} toolbarText='tag(s) will be started' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
        )}
    </div>
    );
};

export default StartPreservationDialog;
