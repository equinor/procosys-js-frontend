import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import Table from './../../../../components/Table';
import { getRequirementColumn, isTagOverdue } from './ScopeTable';
import { Toolbar } from './ScopeTable.style';

interface TransferDialogProps {
    transferableTags: PreservedTag[];
    nonTransferableTags: PreservedTag[];
}

const TransferDialog = ({
    transferableTags,
    nonTransferableTags
}: TransferDialogProps): JSX.Element => {

    const numTransferable = transferableTags.length;
    const numNonTransferable = nonTransferableTags.length;

    return (<div>
        {numNonTransferable > 0 && (
            <div>
                <Typography variant="meta">{numNonTransferable} tag(s) cannot be transferred. Tags are not started/already completed.</Typography>
                <Table
                    columns={[
                        { title: 'Tag nr', field: 'tagNo' },
                        { title: 'Description', field: 'description' },
                        { title: 'Resp', field: 'responsibleCode' },
                        { title: 'Status', field: 'status' },
                        { title: 'Req type', render: getRequirementColumn }
                    ]}
                    data={nonTransferableTags}
                    options={{
                        search: false,
                        pageSize: numNonTransferable > 5 ? 5 : numNonTransferable,
                        pageSizeOptions: [5],
                        showTitle: false,
                        draggable: false,
                        selection: false,
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
                                <Typography style={{ color: tokens.colors.interactive.danger__text.rgba }} variant='h6' >{numNonTransferable} tag(s) will not be transferred</Typography>
                            </Toolbar>
                        )
                    }}

                    style={{ boxShadow: 'none' }}
                />
            </div>
        )}
        {numTransferable > 0 && (<Table
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
                pageSize: numTransferable > 5 ? 5 : numTransferable,
                pageSizeOptions: [5],
                showTitle: false,
                draggable: false,
                selection: false,
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
                        <Typography style={{ color: tokens.colors.interactive.primary__resting.rgba }} variant='h6'>{numTransferable} tag(s) will be transferred</Typography>
                    </Toolbar>
                )
            }}
            style={{ boxShadow: 'none' }}
        />
        )}

    </div>

    );
};

export default TransferDialog;
