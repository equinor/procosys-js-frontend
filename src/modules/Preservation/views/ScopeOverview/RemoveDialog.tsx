import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import DialogTable from './DialogTable';
import { TableOptions, UseTableRowProps } from 'react-table';

interface RemoveDialogProps {
    removableTags: PreservedTag[];
    nonRemovableTags: PreservedTag[];
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

const RemoveDialog = ({
    removableTags: removableTags,
    nonRemovableTags: nonRemovableTags
}: RemoveDialogProps): JSX.Element => {
    return (<div style={{ height: '65vh' }}>
        {nonRemovableTags.length > 0 && (
            <div>
                <Typography variant="meta">{nonRemovableTags.length} tag(s)  cannot be removed. Tags are not voided, or are in use.</Typography>
                <DialogTable tags={nonRemovableTags} columns={columns} toolbarText='tag(s) will not be removed' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
            </div>
        )}
        {removableTags.length > 0 && (
            <DialogTable tags={removableTags} columns={columns} toolbarText='tag(s) will be removed' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
        )}
    </div>
    );
};

export default RemoveDialog;
