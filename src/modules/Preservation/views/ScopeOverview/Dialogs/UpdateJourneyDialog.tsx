import React, { useState } from 'react';
import { PreservedTag } from '../types';
import { Typography } from '@equinor/eds-core-react';
import { tokens } from '@equinor/eds-tokens';
import RequirementIcons from '../RequirementIcons';
import DialogTable from './Shared components/DialogTable';
import { TableOptions, UseTableRowProps } from 'react-table';
import styled from 'styled-components';
import { Tooltip } from '@material-ui/core';
import {
    MainContainer,
    TableContainer,
} from './Shared components/Dialogs.style';

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

interface UpdateJourneyDialogProps {
    tags: PreservedTag[];
    open: boolean;
    onClose: () => void;
}

const UpdateJourneyDialog = ({
    tags,
    open,
    onClose,
}: UpdateJourneyDialogProps): JSX.Element => {
    // TODO: add the form for actually changing the journey, and then add the stuff for actually making it work
    const [nonUpdateableTags, setNonUpdateableTags] = useState<PreservedTag[]>(
        []
    );
    const [updateableTags, setUpdateableTags] = useState<PreservedTag[]>([]);

    return (
        <MainContainer>
            {nonUpdateableTags.length > 0 && (
                <TableContainer isHalfSize={updateableTags.length > 0}>
                    <Typography variant="meta">
                        Journey cannot be updated for
                        {nonUpdateableTags.length} tag(s). Tags are not started,
                        already completed or voided.
                        {
                            // TODO: check when journey cannot be updated for tags.
                        }
                    </Typography>
                    <DialogTable
                        tags={nonUpdateableTags}
                        columns={columns}
                        toolbarText="journey for tag(s) will not be updated"
                        toolbarColor={
                            tokens.colors.interactive.danger__text.rgba
                        }
                    />
                </TableContainer>
            )}
            {updateableTags.length > 0 && (
                <TableContainer isHalfSize={nonUpdateableTags.length > 0}>
                    <DialogTable
                        tags={updateableTags}
                        columns={columns}
                        toolbarText="journey for tag(s) will be updated"
                        toolbarColor={
                            tokens.colors.interactive.primary__resting.rgba
                        }
                    />
                </TableContainer>
            )}
        </MainContainer>
    );
};

export default UpdateJourneyDialog;
