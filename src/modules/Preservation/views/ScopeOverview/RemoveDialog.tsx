import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import { Column } from 'material-table';
import DialogTable from './DialogTable';

interface RemoveDialogProps {
    removableTags: PreservedTag[];
    nonRemovableTags: PreservedTag[];
}

const getRequirementIcons = (tag: PreservedTag): JSX.Element => {
    return (
        <RequirementIcons tag={tag} />
    );
};

const columns: Column<any>[] = [
    { title: 'Tag nr', field: 'tagNo' },
    { title: 'Description', field: 'description' },
    { title: 'Status', field: 'status' },
    { title: 'Req type', render: getRequirementIcons }
];

const RemoveDialog = ({
    removableTags: removableTags,
    nonRemovableTags: nonRemovableTags
}: RemoveDialogProps): JSX.Element => {
    return (<div>
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
