import React, { useEffect, useRef, useState } from 'react';
import Table, { TableProperties } from '@procosys/components/Table';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';
import { TableOptions, UseTableRowProps } from 'react-table';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { PreservedTag } from '@procosys/modules/Preservation/views/ScopeOverview/types';
import { SelectColumnFilter } from './filters';

const Wrapper = styled.div`
    display: flex;
    width: 95%;
    height: 600px;
`;

type LocalTableType = {
    tagNo: string;
    description: string;
    responsibleCode: string;
    disciplineCode: string;
    status: string;
    isVoided: boolean;
};

const columns = [
    {
        Header: 'Tag nr',
        accessor: 'tagNo',
        id: 'tagNo',
        width: 180,
        maxWidth: 400,
        minWidth: 50,
    },
    {
        Header: 'Description',
        accessor: 'description',
        width: 250,
        maxWidth: 400,
        minWidth: 80,
    },
    {
        Header: 'Resp',
        accessor: 'responsibleCode',
        minWidth: 80,
    },
    {
        Header: 'Disc',
        accessor: 'disciplineCode',
        minWidth: 80,
    },
    {
        Header: 'Status',
        accessor: 'status',
        minWidth: 80,
    },
    {
        Header: 'Voided',
        accessor: (d: PreservedTag): string | undefined => {
            return d.isVoided ? 'Voided' : 'Not voided';
        },
        field: 'isVoided',
        Cell: (rowData: TableOptions<PreservedTag>): JSX.Element => {
            return rowData.row.values.Voided === 'Voided' ? (
                <CheckBoxIcon color="disabled" />
            ) : (
                <></>
            );
        },
    },
];

const filteredColumns = [
    {
        Header: 'Tag nr',
        accessor: 'tagNo',
        id: 'tagNo',
        width: 180,
        maxWidth: 400,
        minWidth: 50,
        filter: (
            rows: UseTableRowProps<PreservedTag>[],
            id: number,
            filterType: string
        ): UseTableRowProps<PreservedTag>[] => {
            return rows.filter((row) => {
                return (
                    row.original.tagNo
                        ?.toLowerCase()
                        .indexOf(filterType.toLowerCase()) > -1
                );
            });
        },
    },
    {
        Header: 'Description',
        accessor: 'description',
        width: 250,
        maxWidth: 400,
        minWidth: 80,
        filter: (
            rows: UseTableRowProps<PreservedTag>[],
            id: number,
            filterType: string
        ): UseTableRowProps<PreservedTag>[] => {
            return rows.filter((row) => {
                return (
                    row.original.description
                        ?.toLowerCase()
                        .indexOf(filterType.toLowerCase()) > -1
                );
            });
        },
    },
    {
        Header: 'Resp',
        accessor: 'responsibleCode',
        minWidth: 80,
    },
    {
        Header: 'Disc',
        accessor: 'disciplineCode',
        minWidth: 80,
    },
    {
        Header: 'Status',
        accessor: 'status',
        minWidth: 80,
    },
    {
        Header: 'Voided',
        accessor: (d: PreservedTag): string | undefined => {
            return d.isVoided ? 'Voided' : 'Not voided';
        },
        field: 'isVoided',
        Cell: (rowData: TableOptions<PreservedTag>): JSX.Element => {
            return rowData.row.values.Voided === 'Voided' ? (
                <CheckBoxIcon color="disabled" />
            ) : (
                <></>
            );
        },
        Filter: SelectColumnFilter,
        filter: 'equals',
    },
];

const getData = (): LocalTableType[] => {
    const data = require('./__tests__/data.json');
    const localData = data.tags.map((e: PreservedTag) => {
        return {
            tagNo: e.tagNo,
            description: e.description,
            responsibleCode: e.responsibleCode,
            disciplineCode: e.disciplineCode,
            status: e.status,
            isVoided: e.isVoided,
        } as LocalTableType;
    }) as LocalTableType[];
    return localData;
};

export default {
    title: 'Procosys/Table',
    component: Table,
    parameters: {
        docs: {
            description: {
                component: 'Table component used in Procosys.',
            },
        },
        info: {},
    },
    argTypes: {
        noHeader: {
            options: [true, false],
            control: { type: 'boolean' },
            description: 'Show or hide the column headers.',
        },
        rowSelect: {
            options: [true, false],
            control: { type: 'boolean' },
            description: 'Enable row selectors',
            defaultValue: false,
        },
        toolbarText: {
            control: { type: 'text' },
            description: 'Text shown above the table.',
        },
        clientSorting: {
            options: [true, false],
            control: { type: 'boolean' },
            defaultValue: true,
            description: 'Set to false when implementing server side sorting.',
        },
        loading: {
            options: [true, false],
            control: { type: 'boolean' },
            defaultValue: false,
            description: 'Display loading spinner.',
        },
        onSelectedChange: {
            description: 'Callback when rows are selected / deselected.',
        },
        maxRowCount: {
            description: 'Total number of rows in data.',
        },
        data: {
            description: 'Array containing the table rows.',
        },
        clientPagination: {
            options: [true, false],
            control: { type: 'boolean' },
            defaultValue: true,
            description:
                'Enable client-side pagination. Set to false when implementing server-side pagination.',
        },
        columns: {
            description:
                'Array containing table columns. You specify column filtering in the column definition.',
        },
        setPageSize: {
            description: 'Callback when page size is changed.',
        },
        pageIndex: {
            description: 'Current page.',
            defaultValue: 0,
        },
    },
} as Meta;

export const Default: Story<TableProperties<LocalTableType>> = (
    args: JSX.IntrinsicAttributes & TableProperties<LocalTableType>
) => {
    const [pageSize, setPageSize] = useState(10);
    const [id, setId] = useState<number>(0);
    const prevArgs = useRef<string>();

    useEffect(() => {
        if (Object.keys(args).length > 0) {
            if (prevArgs.current !== JSON.stringify(args)) {
                setId(id + 1);
            }
        }
        prevArgs.current = JSON.stringify(args);
    }, [args]);

    return (
        <Wrapper>
            <Table
                setPageSize={setPageSize}
                key={id}
                {...args}
                pageSize={pageSize}
                columns={columns}
                maxRowCount={50}
                data={getData().slice(0, 50) || []}
            />
        </Wrapper>
    );
};

export const Filtering: Story<TableProperties<LocalTableType>> = (
    args: JSX.IntrinsicAttributes & TableProperties<LocalTableType>
) => {
    return (
        <Wrapper>
            <Table
                {...args}
                pageSize={10}
                columns={filteredColumns}
                maxRowCount={50}
                data={getData().slice(0, 50) || []}
            />
        </Wrapper>
    );
};
