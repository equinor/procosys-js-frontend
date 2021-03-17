import React from 'react';
import styled from 'styled-components';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import DialogTable from './DialogTable';
import EdsIcon from '@procosys/components/EdsIcon';
import { TableOptions, UseTableRowProps } from 'react-table';

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
    return (
        <RequirementIcons tag={tag} />
    );
};

const columns = [
    { Header: 'Tag nr', accessor: 'tagNo' },
    { Header: 'Description', accessor: 'description' },
    { Header: 'Mode', accessor: 'mode' },
    { Header: 'Resp', accessor: 'responsibleCode' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Req type', accessor: (d: UseTableRowProps<PreservedTag>): UseTableRowProps<PreservedTag> => d, Cell: getRequirementIcons }
];

const VoidDialog = ({
    voidableTags,
    unvoidableTags,
    voiding
}: VoidDialogProps): JSX.Element => {
    const topTable = voiding ? unvoidableTags : voidableTags;
    const bottomTable = voiding ? voidableTags : unvoidableTags;

    const voidingText = `${voidableTags.length} tag(s) will be removed from preservation scope.`;
    const unvoidingText = 'Note that tag(s) have been removed from preservation during the period the tag(s) have been voided. Preservation will be started in the same step of the journey as when they were voided.';

    return (
        <div style={{ height: '65vh' }}>
            {topTable.length > 0 && (
                <div style={{ height: '35vh' }}>
                    <Typography variant="meta">{`${topTable.length} tag(s) cannot be ${voiding ? 'voided' : 'unvoided'}.`}</Typography>
                    <DialogTable tags={topTable} columns={columns} toolbarText={`tag(s) are already ${voiding ? 'voided' : 'unvoided'}`} toolbarColor={tokens.colors.interactive.danger__text.rgba} />
                </div>)}
            {bottomTable.length > 0 && (
                <div style={{ height: '35vh' }}>
                    <TopText>
                        <EdsIcon name='warning_filled' color={tokens.colors.interactive.danger__text.rgba} />
                        <Typography variant='h6' style={{ color: tokens.colors.interactive.danger__text.rgba }}>{voiding ? voidingText : unvoidingText}</Typography>
                    </TopText>
                    <DialogTable tags={bottomTable} columns={columns} />
                </div>)}
        </div>);
};

export default VoidDialog;
