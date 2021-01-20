import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import { Column } from 'material-table';
import DialogTable from './DialogTable';

interface PreservedDialogProps {
    preservableTags: PreservedTag[];
    nonPreservableTags: PreservedTag[];
}

const getRequirementIcons = (tag: PreservedTag): JSX.Element => {
    return (
        <RequirementIcons tag={tag} />
    );
};

const columns: Column<any>[] = [
    { title: 'Tag nr', field: 'tagNo', cellStyle: { whiteSpace: 'nowrap' } },
    { title: 'Description', field: 'description' },
    { title: 'Status', field: 'status', cellStyle: { whiteSpace: 'nowrap' } },
    { title: 'Req type', render: getRequirementIcons, cellStyle: { whiteSpace: 'nowrap' } },
];

const PreservedDialog = ({
    preservableTags,
    nonPreservableTags
}: PreservedDialogProps): JSX.Element => {

    return (<div>
        {nonPreservableTags.length > 0 && (
            <div>
                <Typography variant="meta">{nonPreservableTags.length} tag(s) cannot be preserved this week.</Typography>
                <DialogTable tags={nonPreservableTags} columns={columns} toolbarText='tag(s) will not be preserved for this week' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
            </div>
        )}
        {preservableTags.length > 0 && (
            <DialogTable tags={preservableTags} columns={columns} toolbarText='tag(s) will be preserved for this week' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
        )}
    </div>
    );
};

export default PreservedDialog;
