import React from 'react';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import DialogTable from './DialogTable';
import { TableOptions, UseTableRowProps } from 'react-table';
import styled from 'styled-components';
import { Tooltip } from '@material-ui/core';
import { MainContainer, TableContainer } from './Dialogs.style';

interface CompleteDialogProps {
    completableTags: PreservedTag[];
    nonCompletableTags: PreservedTag[];
}

const OverflowColumn = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
`;

const getRequirementIcons = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return <RequirementIcons tag={tag} />;
};

const getTagNoCell = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <Tooltip
            title={tag.tagNo || ''}
            arrow={true}
            enterDelay={200}
            enterNextDelay={100}
        >
            <OverflowColumn>{tag.tagNo}</OverflowColumn>
        </Tooltip>
    );
};

const getDescriptionCell = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <Tooltip
            title={tag.description || ''}
            arrow={true}
            enterDelay={200}
            enterNextDelay={100}
        >
            <OverflowColumn>{tag.description}</OverflowColumn>
        </Tooltip>
    );
};

const getStatusCell = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <Tooltip
            title={tag.status || ''}
            arrow={true}
            enterDelay={200}
            enterNextDelay={100}
        >
            <OverflowColumn>{tag.status}</OverflowColumn>
        </Tooltip>
    );
};

const columns = [
    {
        Header: 'Tag nr',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getTagNoCell,
    },
    {
        Header: 'Description',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getDescriptionCell,
    },
    {
        Header: 'Status',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getStatusCell,
    },
    {
        Header: 'Req type',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        id: 'reqtype',
        Cell: getRequirementIcons,
    },
];

const CompleteDialog = ({
    completableTags,
    nonCompletableTags,
}: CompleteDialogProps): JSX.Element => {
    return (
        <MainContainer>
            {nonCompletableTags.length > 0 && (
                <TableContainer isHalfSize={completableTags.length > 0}>
                    <Typography variant="meta">
                        {nonCompletableTags.length} tag(s) cannot be completed.
                        Tags are not started, already completed or voided.
                    </Typography>
                    <DialogTable
                        tags={nonCompletableTags}
                        columns={columns}
                        toolbarText="tag(s) will not be completed"
                        toolbarColor={
                            tokens.colors.interactive.danger__text.rgba
                        }
                    />
                </TableContainer>
            )}
            {completableTags.length > 0 && (
                <TableContainer isHalfSize={nonCompletableTags.length > 0}>
                    <DialogTable
                        tags={completableTags}
                        columns={columns}
                        toolbarText="tag(s) will be completed"
                        toolbarColor={
                            tokens.colors.interactive.primary__resting.rgba
                        }
                    />
                </TableContainer>
            )}
        </MainContainer>
    );
};

export default CompleteDialog;
