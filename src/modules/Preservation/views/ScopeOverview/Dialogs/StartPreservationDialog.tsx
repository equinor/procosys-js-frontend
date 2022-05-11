import React from 'react';
import { PreservedTag } from '../types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from '../RequirementIcons';
import DialogTable from './SharedCode/DialogTable';
import { TableOptions, UseTableRowProps } from 'react-table';
import styled from 'styled-components';
import { MainContainer, TableContainer } from './SharedCode/Dialogs.style';
import { Tooltip } from '@mui/material';

interface StartPreservationDialogProps {
    startableTags: PreservedTag[];
    nonStartableTags: PreservedTag[];
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

const StartPreservationDialog = ({
    startableTags,
    nonStartableTags,
}: StartPreservationDialogProps): JSX.Element => {
    return (
        <MainContainer>
            {nonStartableTags.length > 0 && (
                <TableContainer isHalfSize={startableTags.length > 0}>
                    <Typography variant="meta">
                        {nonStartableTags.length} tag(s) cannot be started. Tags
                        are already started, or are voided.
                    </Typography>
                    <DialogTable
                        tags={nonStartableTags}
                        columns={columns}
                        toolbarText="tag(s) will not be started"
                        toolbarColor={
                            tokens.colors.interactive.danger__text.rgba
                        }
                    />
                </TableContainer>
            )}
            {startableTags.length > 0 && (
                <TableContainer isHalfSize={nonStartableTags.length > 0}>
                    <DialogTable
                        tags={startableTags}
                        columns={columns}
                        toolbarText="tag(s) will be started"
                        toolbarColor={
                            tokens.colors.interactive.primary__resting.rgba
                        }
                    />
                </TableContainer>
            )}
        </MainContainer>
    );
};

export default StartPreservationDialog;
