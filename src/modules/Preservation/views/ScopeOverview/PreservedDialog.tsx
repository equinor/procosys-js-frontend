import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import DialogTable from './DialogTable';
import { TableOptions, UseTableRowProps } from 'react-table';
import styled from 'styled-components';
import { MainContainer, TableContainer } from './Dialogs.style';

interface PreservedDialogProps {
    preservableTags: PreservedTag[];
    nonPreservableTags: PreservedTag[];
}

const getRequirementIcons = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <RequirementIcons tag={tag} />
    );
};

const columns = [
    { Header: 'Tag nr', accessor: 'tagNo', id: 'tagNo' },
    { Header: 'Description', accessor: 'description', id: 'description' },
    { Header: 'Status', accessor: 'status', id: 'status' },
    { Header: 'Req type', accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d, id: 'reqtype', Cell: getRequirementIcons }
];

const PreservedDialog = ({
    preservableTags,
    nonPreservableTags
}: PreservedDialogProps): JSX.Element => {

    return (
        <MainContainer>
            {nonPreservableTags.length > 0 && (
                <TableContainer isHalfSize={preservableTags.length > 0}>
                    <Typography variant="meta">{nonPreservableTags.length} tag(s) cannot be preserved this week.</Typography>
                    <DialogTable tags={nonPreservableTags} columns={columns} toolbarText='tag(s) will not be preserved for this week' toolbarColor={tokens.colors.interactive.danger__text.rgba} />
                </TableContainer>
            )}
            {preservableTags.length > 0 && (
                <TableContainer isHalfSize={nonPreservableTags.length > 0}>
                    <DialogTable tags={preservableTags} columns={columns} toolbarText='tag(s) will be preserved for this week' toolbarColor={tokens.colors.interactive.primary__resting.rgba} />
                </TableContainer>
            )}
        </MainContainer>
    );
};

export default PreservedDialog;
