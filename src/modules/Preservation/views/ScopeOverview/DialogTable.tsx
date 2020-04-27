import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import Table from '../../../../components/Table';
import { Toolbar } from './DialogTable.style';
import { isTagOverdue } from './ScopeOverview';
import { Column } from 'material-table';

interface TableProps {
    tags: PreservedTag[];
    columns: Column<any>[];
    toolbarText: string;
    toolbarColor: string;
}

const DialogTable = ({
    tags,
    columns,
    toolbarText,
    toolbarColor
}: TableProps): JSX.Element => {

    const numTags = tags.length;

    return (<Table
        columns={columns}
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

export default DialogTable;
