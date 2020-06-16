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
    tags: PreservedTag[];
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

const voidingText = 'Tags will be removed from preservation scope';
const unVoidingText = 'Note that tags have been removed from preservation during the period the tags have been voided. Preservation will be started in the same step of the journey as when they were voided.';

const columns: Column<any>[] = [
    { title: 'Tag nr', field: 'tagNo' },
    { title: 'Description', field: 'description' },
    { title: 'Mode', field: 'mode' },
    { title: 'Resp', field: 'responsibleCode' },
    { title: 'Status', field: 'status' },
    { title: 'Req type', render: getRequirementIcons }
];

const VoidDialog = ({
    tags,
    voiding
}: VoidDialogProps): JSX.Element => {

    return (<div>
        <TopText>
            <EdsIcon name='warning_filled' color={tokens.colors.interactive.danger__text.rgba}/>
            <Typography variant="caption" style={{color: tokens.colors.interactive.danger__text.rgba}}>{voiding ? voidingText : unVoidingText} </Typography>
        </TopText>
        <DialogTable tags={tags} columns={columns} />
    </div>
    );
};

export default VoidDialog;
