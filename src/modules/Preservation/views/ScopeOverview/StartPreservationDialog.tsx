import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import DialogTable from './DialogTable';
import { Column } from 'material-table';

interface StartPreservationDialogProps {
    startableTags: PreservedTag[];
    nonStartableTags: PreservedTag[];
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

const StartPreservationDialog = ({
    startableTags,
    nonStartableTags
}: StartPreservationDialogProps): JSX.Element => {

    return (<div>
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
