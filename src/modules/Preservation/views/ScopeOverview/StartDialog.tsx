import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import Table from '../../../../components/Table';
import RequirementIcons from './RequirementIcons';
import { Toolbar } from './StartDialog.style';
import { isTagOverdue } from './ScopeOverview';

interface StartDialogProps {
    startableTags: PreservedTag[];
    nonStartableTags: PreservedTag[];
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

const StartTable = ({
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

const StartDialog = ({
    startableTags,
    nonStartableTags
}: StartDialogProps): JSX.Element => {

    return (<div>
        {nonStartableTags.length > 0 && (
            <div>
                <Typography variant="meta">{nonStartableTags.length} tag(s) cannot be started.</Typography>
                <StartTable tags={nonStartableTags} toolbarText='tag(s) will not be started' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
            </div>
        )}
        {startableTags.length > 0 && (
            <StartTable tags={startableTags} toolbarText='tag(s) will be started' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
        )}
    </div>
    );
};

export default StartDialog;
