import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import Table from './../../../../components/Table';
import RequirementIcons from './RequirementIcons';
import { Toolbar } from './TransferDialog.style';
import { isTagOverdue } from './ScopeOverview';

interface TransferDialogProps {
    transferableTags: PreservedTag[];
    nonTransferableTags: PreservedTag[];
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

const TransferTable = ({
    tags,
    toolbarText,
    toolbarColor
}: TableProps): JSX.Element => {

    const numTags = tags.length;

    return (<Table
        columns={[
            { title: 'Tag nr', field: 'tagNo' },
            { title: 'Description', field: 'description' },
            { title: 'Resp', field: 'responsibleCode' },
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

const TransferDialog = ({
    transferableTags,
    nonTransferableTags
}: TransferDialogProps): JSX.Element => {

    return (<div>
        {nonTransferableTags.length > 0 && (
            <div>
                <Typography variant="meta">{nonTransferableTags.length} tag(s) cannot be transferred. Tags are not started/already completed.</Typography>
                <TransferTable tags={nonTransferableTags} toolbarText='tag(s) will not be transferred' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
            </div>
        )}
        {transferableTags.length > 0 && (
            <TransferTable tags={transferableTags} toolbarText='tag(s) will be transferred' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
        )}
    </div>
    );
};

export default TransferDialog;
