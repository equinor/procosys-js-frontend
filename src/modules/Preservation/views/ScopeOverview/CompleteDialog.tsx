import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import { Column } from 'material-table';
import DialogTable from './DialogTable';

interface CompleteDialogProps {
    tags: PreservedTag[];
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

const CompleteDialog = ({
    tags
}: CompleteDialogProps): JSX.Element => {

    const completableTags: PreservedTag[] = [];
    const nonCompletableTags: PreservedTag[] = [];

    tags.forEach((tag) => {
        if (tag.readyToBeCompleted) {
            completableTags.push(tag);
            return;
        }
        nonCompletableTags.push(tag);
    });


    return (<div>
        {nonCompletableTags.length > 0 && (
            <div>
                <Typography variant="meta">{nonCompletableTags.length} tag(s) cannot be completed.</Typography>
                <DialogTable tags={nonCompletableTags} columns={columns} toolbarText='tag(s) will not be completed' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
            </div>
        )}
        {completableTags.length > 0 && (
            <DialogTable tags={completableTags} columns={columns} toolbarText='tag(s) will be completed' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
        )}
    </div>
    );
};

export default CompleteDialog;
