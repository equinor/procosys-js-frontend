import React from 'react';
import styled from 'styled-components';
import { PreservedTag } from '../types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from '../RequirementIcons';
import DialogTable from './SharedCode/DialogTable';
import EdsIcon from '@procosys/components/EdsIcon';
import { TableOptions, UseTableRowProps } from 'react-table';
import { Tooltip } from '@material-ui/core';
import { OverflowColumn } from './RescheduleDialog.style';
import { MainContainer, TableContainer } from './SharedCode/Dialogs.style';

interface VoidDialogProps {
    voidableTags: PreservedTag[];
    unvoidableTags: PreservedTag[];
    voiding: boolean;
}

export const TopText = styled.div`
    display: flex;
    align-items: center;
    padding-top: var(--grid-unit);
    svg {
        padding-right: var(--grid-unit);
    }
`;

const getRequirementIcons = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return <RequirementIcons tag={tag} />;
};

const getTagNoColumn = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <div className="tableCell">
            <Tooltip
                title={tag.tagNo}
                arrow={true}
                enterDelay={200}
                enterNextDelay={100}
            >
                <OverflowColumn>{tag.tagNo}</OverflowColumn>
            </Tooltip>
        </div>
    );
};

const getDescriptionColumn = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <div className="tableCell">
            <Tooltip
                title={tag.description}
                arrow={true}
                enterDelay={200}
                enterNextDelay={100}
            >
                <OverflowColumn>{tag.description}</OverflowColumn>
            </Tooltip>
        </div>
    );
};

const getStatusColumn = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <div className="tableCell">
            <Tooltip
                title={tag.status}
                arrow={true}
                enterDelay={200}
                enterNextDelay={100}
            >
                <OverflowColumn>{tag.status}</OverflowColumn>
            </Tooltip>
        </div>
    );
};

const getModeColumn = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <div className="tableCell">
            <Tooltip
                title={tag.mode}
                arrow={true}
                enterDelay={200}
                enterNextDelay={100}
            >
                <OverflowColumn>{tag.mode}</OverflowColumn>
            </Tooltip>
        </div>
    );
};

const getResponsibleColumn = (row: TableOptions<PreservedTag>): JSX.Element => {
    const tag = row.value as PreservedTag;
    return (
        <div className="tableCell">
            <Tooltip
                title={tag.responsibleCode}
                arrow={true}
                enterDelay={200}
                enterNextDelay={100}
            >
                <OverflowColumn>{tag.responsibleCode}</OverflowColumn>
            </Tooltip>
        </div>
    );
};

const columns = [
    {
        Header: 'Tag nr',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getTagNoColumn,
    },
    {
        Header: 'Description',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getDescriptionColumn,
    },
    {
        Header: 'Mode',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getModeColumn,
    },
    {
        Header: 'Resp',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getResponsibleColumn,
    },
    {
        Header: 'Status',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getStatusColumn,
    },
    {
        Header: 'Req type',
        accessor: (
            d: UseTableRowProps<PreservedTag>
        ): UseTableRowProps<PreservedTag> => d,
        Cell: getRequirementIcons,
    },
];

const VoidDialog = ({
    voidableTags,
    unvoidableTags,
    voiding,
}: VoidDialogProps): JSX.Element => {
    const topTable = voiding ? unvoidableTags : voidableTags;
    const bottomTable = voiding ? voidableTags : unvoidableTags;

    const voidingText = `${voidableTags.length} tag(s) will be removed from preservation scope.`;
    const unvoidingText =
        'Note that tag(s) have been removed from preservation during the period the tag(s) have been voided. Preservation will be started in the same step of the journey as when they were voided.';

    return (
        <MainContainer>
            {topTable.length > 0 && (
                <TableContainer isHalfSize={bottomTable.length > 0}>
                    <Typography variant="meta">{`${
                        topTable.length
                    } tag(s) cannot be ${
                        voiding ? 'voided' : 'unvoided'
                    }.`}</Typography>
                    <DialogTable
                        tags={topTable}
                        columns={columns}
                        toolbarText={`tag(s) are already ${
                            voiding ? 'voided' : 'unvoided'
                        }`}
                        toolbarColor={
                            tokens.colors.interactive.danger__text.rgba
                        }
                    />
                </TableContainer>
            )}
            {bottomTable.length > 0 && (
                <TableContainer isHalfSize={topTable.length > 0}>
                    <TopText>
                        <EdsIcon
                            name="warning_filled"
                            color={tokens.colors.interactive.danger__text.rgba}
                        />
                        <Typography
                            variant="h6"
                            style={{
                                color: tokens.colors.interactive.danger__text
                                    .rgba,
                            }}
                        >
                            {voiding ? voidingText : unvoidingText}
                        </Typography>
                    </TopText>
                    <DialogTable tags={bottomTable} columns={columns} />
                </TableContainer>
            )}
        </MainContainer>
    );
};

export default VoidDialog;
