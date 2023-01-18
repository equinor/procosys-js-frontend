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

interface TransferDialogProps {
    transferableTags: PreservedTag[];
    nonTransferableTags: PreservedTag[];
}

const OverflowColumn = styled.div<{ isVoided: boolean }>`
    text-overflow: ellipsis;
    overflow: hidden;
    color: inherit;
    opacity: ${(props): string => (props.isVoided ? '0.5' : '1')};
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
            <OverflowColumn isVoided={tag.isVoided}>{tag.tagNo}</OverflowColumn>
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
            <OverflowColumn isVoided={tag.isVoided}>
                {tag.description}
            </OverflowColumn>
        </Tooltip>
    );
};

const getModeCell = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <Tooltip
            title={tag.mode || ''}
            arrow={true}
            enterDelay={200}
            enterNextDelay={100}
        >
            <OverflowColumn isVoided={tag.isVoided}>{tag.mode}</OverflowColumn>
        </Tooltip>
    );
};

const getResponsibleCell = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <Tooltip
            title={tag.responsibleCode || ''}
            arrow={true}
            enterDelay={200}
            enterNextDelay={100}
        >
            <OverflowColumn isVoided={tag.isVoided}>
                {tag.responsibleCode}
            </OverflowColumn>
        </Tooltip>
    );
};

const getNextModeCell = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <Tooltip
            title={tag.nextMode || ''}
            arrow={true}
            enterDelay={200}
            enterNextDelay={100}
        >
            <OverflowColumn isVoided={tag.isVoided}>
                {tag.nextMode}
            </OverflowColumn>
        </Tooltip>
    );
};

const getNextResponsibleCell = (
    row: TableOptions<PreservedTag>
): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <Tooltip
            title={tag.nextResponsibleCode || ''}
            arrow={true}
            enterDelay={200}
            enterNextDelay={100}
        >
            <OverflowColumn isVoided={tag.isVoided}>
                {tag.nextResponsibleCode}
            </OverflowColumn>
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
            <OverflowColumn isVoided={tag.isVoided}>
                {tag.status}
            </OverflowColumn>
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
        Header: 'From mode',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getModeCell,
    },
    {
        Header: 'From resp',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getResponsibleCell,
    },
    {
        Header: 'To mode',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getNextModeCell,
    },
    {
        Header: 'To resp',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getNextResponsibleCell,
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
        Cell: getRequirementIcons,
    },
];

const TransferDialog = ({
    transferableTags,
    nonTransferableTags,
}: TransferDialogProps): JSX.Element => {
    return (
        <MainContainer>
            {nonTransferableTags.length > 0 && (
                <TableContainer isHalfSize={transferableTags.length > 0}>
                    <Typography variant="meta">
                        {nonTransferableTags.length} tag(s) cannot be
                        transferred. Tags are not started, already completed or
                        voided.
                    </Typography>
                    <DialogTable
                        tags={nonTransferableTags}
                        columns={columns}
                        toolbarText="tag(s) cannot be transferred"
                        toolbarColor={
                            tokens.colors.interactive.danger__text.rgba
                        }
                    />
                </TableContainer>
            )}
            {transferableTags.length > 0 && (
                <TableContainer isHalfSize={nonTransferableTags.length > 0}>
                    <DialogTable
                        tags={transferableTags}
                        columns={columns}
                        toolbarText="tag(s) will be transferred"
                        toolbarColor={
                            tokens.colors.interactive.primary__resting.rgba
                        }
                    />
                </TableContainer>
            )}
        </MainContainer>
    );
};

export default TransferDialog;
