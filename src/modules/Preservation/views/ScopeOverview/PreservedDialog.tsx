import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import Table from '../../../../components/Table';
import RequirementIcons from './RequirementIcons';
import { Toolbar } from './PreservedDialog.style';
import { isTagOverdue } from './ScopeOverview';

interface PreservedDialogProps {
    preservableTags: PreservedTag[];
    nonPreservableTags: PreservedTag[];
}

interface TableProps {
    tags: PreservedTag[];
    toolbarText: string;
    toolbarColor: string;
}

const getRequirementIcons = (tag: PreservedTag): JSX.Element => {
    return (
        <RequirementIcons tag={tag} />
    );
};

const PreservedTable = ({
    tags,
    toolbarText,
    toolbarColor
}: TableProps): JSX.Element => {

    const numTags = tags.length;

    return (<Table
        columns={[
            { title: 'Tag nr', field: 'tagNo' },
            { title: 'Description', field: 'description' },
            { title: 'From Mode', field: 'mode' },
            { title: 'From Resp', field: 'responsibleCode' },
            { title: 'To Mode', field: 'nextMode' },
            { title: 'To Resp', field: 'nextResponsibleCode' },
            { title: 'Status', field: 'status' },
            { title: 'Req type', render: getRequirementIcons }
        ]}
        data={tags}
        options={{
            search: false,
            pageSize: 5,
            pageSizeOptions: [5, 10, 50, 100],
            showTitle: false,
            draggable: false,
            selection: false,
            emptyRowsWhenPaging: false,
            headerStyle: {
                backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba
            },
            rowStyle: (rowData): any => ({
                color: isTagOverdue(rowData) && tokens.colors.interactive.danger__text.rgba,
            }),
        }}
        components={{
            Toolbar: (): any => (
                <Toolbar>
                    <Typography style={{ color: toolbarColor }} variant='h6' >{numTags} {toolbarText}</Typography>
                </Toolbar>
            )
        }}

        style={{ boxShadow: 'none' }}
    />);
};

const PreservedDialog = ({
    preservableTags,
    nonPreservableTags
}: PreservedDialogProps): JSX.Element => {

    return (<div>
        {nonPreservableTags.length > 0 && (
            <div>
                <Typography variant="meta">{nonPreservableTags.length} tag(s) cannot be preserved this week.</Typography>
                <PreservedTable tags={nonPreservableTags} toolbarText='tag(s) will not be preserved for this week' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
            </div>
        )}
        {preservableTags.length > 0 && (
            <PreservedTable tags={preservableTags} toolbarText='tag(s) will be preserved for this week' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
        )}
    </div>
    );
};

export default PreservedDialog;
