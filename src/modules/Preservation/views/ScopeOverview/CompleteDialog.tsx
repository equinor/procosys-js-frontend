import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import DialogTable from './DialogTable';
import { TableOptions, UseTableRowProps } from 'react-table';

interface CompleteDialogProps {
    completableTags: PreservedTag[];
    nonCompletableTags: PreservedTag[];
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

const CompleteDialog = ({
    completableTags,
    nonCompletableTags
}: CompleteDialogProps): JSX.Element => {
    return (<div style={{ height: '70vh' }}>
        {nonCompletableTags.length > 0 && (
            <div style={{ height: '50%' }}>
                <Typography variant="meta">{nonCompletableTags.length} tag(s) cannot be completed. Tags are not started, already completed or voided.</Typography>
                <DialogTable tags={nonCompletableTags} columns={columns} toolbarText='tag(s) will not be completed' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
            </div>
        )}
        {completableTags.length > 0 && (
            <div style={{ height: '50%' }}>
                <DialogTable tags={completableTags} columns={columns} toolbarText='tag(s) will be completed' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
            </div>
        )}
    </div>
    );
};

export default CompleteDialog;
