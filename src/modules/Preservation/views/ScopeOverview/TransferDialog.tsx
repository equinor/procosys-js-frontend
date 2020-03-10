import React from 'react';
import { PreservedTag } from './types';

import { tokens } from '@equinor/eds-tokens';
import Table from './../../../../components/Table';
import { getRequirementColumn, isTagOverdue } from './ScopeTable';

interface TransferDialogProps {
    selectedTags: PreservedTag[];
}

const TransferDialog = ({
    selectedTags
}: TransferDialogProps): JSX.Element => {

    const transferableTags: PreservedTag[] = selectedTags.filter(tag => tag.readyToBeTransferred);
    const nonTransferableTags: PreservedTag[] = selectedTags.filter(tag => !tag.readyToBeTransferred);

    return (<div>
        <div>transferable</div>
        {transferableTags && (<Table
            columns={[
                { title: 'Tag nr', field: 'tagNo' },
                { title: 'Description', field: 'description' },
                { title: 'Resp', field: 'responsibleCode' },
                { title: 'Status', field: 'status' },
                { title: 'Req type', render: getRequirementColumn }
            ]}
            data={transferableTags}
            options={{
                search: false,
                paging: false,
                headerStyle: {
                    backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba
                },
                rowStyle: (rowData): any => ({
                    color: isTagOverdue(rowData) && tokens.colors.interactive.danger__text.rgba,
                    backgroundColor: rowData.tableData.checked && tokens.colors.interactive.primary__selected_highlight.rgba
                }),
            }}
            style={{ boxShadow: 'none' }}
        />
        )}
        <div>non transferable</div>
        {nonTransferableTags && (<Table
            columns={[
                { title: 'Tag nr', field: 'tagNo' },
                { title: 'Description', field: 'description' },
                { title: 'Resp', field: 'responsibleCode' },
                { title: 'Status', field: 'status' },
                { title: 'Req type', render: getRequirementColumn }
            ]}
            data={nonTransferableTags}
            options={{
                showTitle: false,
                draggable: false,
                selection: false,
                pageSize: 5,
                headerStyle: {
                    backgroundColor: tokens.colors.interactive.table__header__fill_resting.rgba
                },
                rowStyle: (rowData): any => ({
                    color: isTagOverdue(rowData) && tokens.colors.interactive.danger__text.rgba,
                    backgroundColor: rowData.tableData.checked && tokens.colors.interactive.primary__selected_highlight.rgba
                }),
            }}
            components={{}}

            style={{ boxShadow: 'none' }}
        />
        )}

    </div>

    );
};

export default TransferDialog;
