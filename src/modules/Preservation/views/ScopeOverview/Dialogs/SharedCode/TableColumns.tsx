import React from 'react';
import { TableOptions, UseTableRowProps } from 'react-table';
import { Tooltip } from '@material-ui/core';
import styled from 'styled-components';
import RequirementIcons from '../../RequirementIcons';
import { PreservedTag } from '../../types';

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

export const columns = [
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
