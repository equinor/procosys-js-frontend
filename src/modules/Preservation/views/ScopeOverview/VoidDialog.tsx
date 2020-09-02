import React from 'react';
import styled from 'styled-components';
import { PreservedTag } from './types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from './RequirementIcons';
import DialogTable from './DialogTable';
import { Column } from 'material-table';
import EdsIcon from '@procosys/components/EdsIcon';

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

const getRequirementIcons = (tag: PreservedTag): JSX.Element => {
    return (
        <RequirementIcons tag={tag} />
    );
};

const columns: Column<any>[] = [
    { title: 'Tag nr', field: 'tagNo' },
    { title: 'Description', field: 'description' },
    { title: 'Mode', field: 'mode' },
    { title: 'Resp', field: 'responsibleCode' },
    { title: 'Status', field: 'status' },
    { title: 'Req type', render: getRequirementIcons }
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

    return (<div>
        {topTable.length > 0 && (
            <div>
                <Typography variant="meta">{`${topTable.length} tag(s) cannot be ${voiding ? 'voided' : 'unvoided'}.`}</Typography>
                <DialogTable tags={topTable} columns={columns} toolbarText={`tag(s) are already ${voiding ? 'voided' : 'unvoided'}`} toolbarColor={tokens.colors.interactive.danger__text.rgba} />
            </div>)}
        {bottomTable.length > 0 && (
            <div>
                <TopText>
                    <EdsIcon name='warning_filled' color={tokens.colors.interactive.danger__text.rgba}/>
                    <Typography variant='h6' style={{color: tokens.colors.interactive.danger__text.rgba}}>{voiding ? voidingText : unvoidingText}</Typography>
                </TopText>
                <DialogTable tags={bottomTable} columns={columns} />
            </div>)}
    </div>);
};

export default VoidDialog;
