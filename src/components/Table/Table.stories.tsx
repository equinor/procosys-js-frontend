import React, { useState } from 'react';
import Table from '@procosys/components/Table';
import { Story, Meta } from '@storybook/react';
import styled from 'styled-components';

const tags = require('./__tests__/data.json');

const Wrapper = styled.div`
  display: flex;
  width: 90%;
  height: 600px;
`;

const columns = [
    {
        Header: 'Tag nr',
        accessor: 'tagNo',
        id: 'tagNo',
        width: 180,
        maxWidth: 400,
        minWidth: 150
    },
    {
        Header: 'Description',
        accessor: 'description',
        width: 250,
        maxWidth: 400,
        minWidth: 150
    },
    {
        Header: 'Resp',
        accessor: 'responsibleCode'
    },
    {
        Header: 'Disc',
        accessor: 'disciplineCode'
    },
    {
        Header: 'Status',
        accessor: 'actionStatus'
    }
];
const maxRows = 100;

export default {
    title: 'Procosys/Table',
    component: Table,
    parameters: {
        docs: {
            description: {
                component: `Table component used in Procosys.
        `,
            },
        },
        info: {},
    },
    args: {
        // data: items
    }
} as Meta;

export const Default: Story = (args: JSX.IntrinsicAttributes) => {
    const [pageSize, setPageSize] = useState(5);

    return (
        <Wrapper>
            <Table setPageSize={setPageSize}
                clientPagination={true}
                clientSorting={true}
                pageIndex={0}
                pageSize={10}
                columns={columns}
                maxRowCount={maxRows}
                data={tags.tags}
                loading={false}
                pageCount={1} />
        </Wrapper>

    );
};